import type { SqlConnState } from "./pg-conn.js";
import * as m from "./memoize.js";
import * as t from "./tree.js";

// when querying GitLab as a CMS, see ERD at https://azimutt.app/new?sample=gitlab

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export interface Namespace {
  readonly id: number;
  readonly parentID?: number;
  readonly name: string;
  readonly path: string;
  readonly description: string;
  readonly avatar: string;
}

export interface NamespaceContent {
  readonly namespace: Namespace;
  readonly contentCollections: () => Promise<ContentCollections>;
  readonly users: () => Promise<Users>;
}

export const namespacesContent = new Map<string, NamespaceContent>();

export async function namespaceContent(
  conn: SqlConnState,
  name: string,
): Promise<NamespaceContent | undefined> {
  let result = namespacesContent.get(name);
  if (!result) {
    const namespaceQR = await gitLabNamespaceQR(conn, name)();
    if (namespaceQR && namespaceQR.length == 1) {
      const namespace = namespaceQR[0]!;
      result = {
        namespace,
        contentCollections: m.singleton(async () => {
          const assignments = new TypicalContentCollections(namespace);
          await assignments.populate(conn);
          return assignments;
        }),
        users: m.singleton(async () => {
          const users = new TypicalUsers(namespace);
          await users.populate(conn);
          return users;
        }),
      };
      namespacesContent.set(name, result);
    }
  }
  return result;
}

export const gitLabNamespaceQR = (conn: SqlConnState, name: string) =>
  conn.memoizableSqlResults(async () => {
    return await conn.SQL<Namespace[]>`
    select id, parent_id as "parentID", name, path, description, avatar
      from namespaces
    where name = ${name}`;
  }, `gitlab-pkcNamespace-${name}`);

export const qualifiedComponentsDelim = ":/:";
export type ContentCollectionPathComponent = string;
export type ContentCollectionPath = string;
export type ContentCollectionName = string;
export type ContentCollectionAbbreviation = string;

export interface MutableContentAnalytics {
  todosCount: number;
  viewedCount: number;
  completedCount: number;
  irrelevantCount: number;
  ignoredCount: number;
}

export type ContentAnalytics = Readonly<MutableContentAnalytics>;

export interface ContentCollection {
  readonly url: ContentCollectionPath;
  readonly name: ContentCollectionName;
  readonly abbrev: ContentCollectionAbbreviation;
  readonly groupPathComponent: ContentCollectionPathComponent;
  readonly qualifiedPathComponents: ContentCollectionPathComponent[];
  readonly qualifiedNameComponents: ContentCollectionName[];
  readonly description: string;
  readonly items: Content[];
  readonly analytics: ContentAnalytics;
  readonly register: (assn: Content) => number;
}

export interface ContentCollections {
  readonly namespace: Namespace;
  readonly collections: ContentCollection[];
  readonly pathTree: t.PathTree<
    { cc: ContentCollection; content: Content },
    Pick<Namespace, "name">
  >;
}

export interface Content extends ContentAnalytics {
  readonly groupURL: string;
  readonly groupPathComponent: string;
  readonly groupName: string;
  readonly groupNameQualified: string;
  readonly groupDescription: string;
  readonly projectURL: string;
  readonly projectPath: string;
  readonly projectName: string;
  readonly projectNameQualified: string;
  readonly projectDescription: string;
  readonly assignmentId: number;
  readonly assignmentIID: number;
  readonly assignmentTitle: string;
  readonly assignmentDescription: string;
  readonly assignmentTitleHTML: string;
  readonly assignmentDescriptionHTML: string;
  readonly assignmentCreatedByUserName: string;
  readonly assignmentCreatedByUserID: number;
  readonly assignmentCreatedAt: Date;
  readonly assignmentDueOn: Date;
  readonly assignmentDueInDays: number;
  readonly authorizedUserIds: number[];
  readonly assignedUserIds: number[];
  readonly mentionedUserIds: number[];
  readonly viewedByUserIds: number[];
  readonly completedByUserIds: number[];
  readonly irrelevantByUserIds: number[];
}

export class TypicalContentCollection implements ContentCollection {
  static captionPrepRegExp = /\b(\w)/g;

  #analytics: MutableContentAnalytics;
  readonly url: ContentCollectionPath;
  readonly name: ContentCollectionName;
  readonly abbrev: ContentCollectionAbbreviation;
  readonly groupPathComponent: ContentCollectionPathComponent;
  readonly qualifiedPathComponents: ContentCollectionPathComponent[];
  readonly qualifiedNameComponents: ContentCollectionName[];
  readonly description: string;
  readonly items: Content[] = [];

  constructor(
    props: Pick<
      ContentCollection,
      | "url"
      | "description"
      | "name"
      | "qualifiedNameComponents"
      | "qualifiedPathComponents"
      | "groupPathComponent"
    >,
  ) {
    this.url = props.url;
    this.name = props.name;
    this.abbrev =
      props.name.match(TypicalContentCollection.captionPrepRegExp)?.join("") ??
      "??";
    this.description = props.description;
    this.qualifiedPathComponents = props.qualifiedPathComponents;
    this.qualifiedNameComponents = props.qualifiedNameComponents;
    this.groupPathComponent = props.groupPathComponent;
    this.#analytics = {
      viewedCount: 0,
      completedCount: 0,
      todosCount: 0,
      irrelevantCount: 0,
      ignoredCount: 0,
    };
  }

  get analytics(): ContentAnalytics {
    return this.#analytics;
  }

  register(assn: Content): number {
    // TODO: check for duplicates
    const prepareAssn: Content = {
      ...assn,
      // these might be bigint from PostgreSQL so convert it now for convenience
      // because we use map/reduce in other parts of the code and JS does not like
      // summing/computing between bigint and number types.
      todosCount: Number(assn.todosCount),
      viewedCount: Number(assn.viewedCount),
      completedCount: Number(assn.completedCount),
      irrelevantCount: Number(assn.irrelevantCount),
      ignoredCount: Number(assn.ignoredCount),
    };
    this.#analytics.todosCount += prepareAssn.todosCount;
    this.#analytics.viewedCount += prepareAssn.viewedCount;
    this.#analytics.completedCount += prepareAssn.completedCount;
    this.#analytics.irrelevantCount += prepareAssn.irrelevantCount;
    this.#analytics.ignoredCount += prepareAssn.ignoredCount;
    return this.items.push(prepareAssn);
  }
}

export class TypicalContentCollections implements ContentCollections {
  static readonly singleton = (conn: SqlConnState, ns: Namespace) =>
    m.singleton(async () => {
      const assignments = new TypicalContentCollections(ns);
      await assignments.populate(conn);
      return assignments;
    });
  readonly collections: ContentCollection[] = [];
  readonly pathTree: t.PathTree<
    { cc: ContentCollection; content: Content },
    Pick<Namespace, "name">
  > = { children: [] };

  constructor(readonly namespace: Namespace) {}

  async populate(conn: SqlConnState): Promise<ContentCollections> {
    const assignments = await m.singleton(
      gitLabIssuesQR(conn, this.namespace),
    )();
    for (const row of assignments) {
      const acID = row.projectURL;
      let ac = this.collections.find((c) => c.url == acID);
      if (!ac) {
        ac = new TypicalContentCollection({
          url: acID,
          name: row.projectName,
          description: row.projectDescription,
          qualifiedPathComponents: row.groupURL.split("/"),
          qualifiedNameComponents: row.groupNameQualified.split(
            qualifiedComponentsDelim,
          ),
          groupPathComponent: row.projectPath,
        });
        this.collections.push(ac);
      }
      ac.register(row);
      t.populatePathTree(
        { terminal: { cc: ac, content: row } },
        this.pathTree,
        () => [...ac!.qualifiedPathComponents, row.projectPath],
        (node) => ({
          ...node,
          intermediary: { name: row.groupName },
        }),
      );
    }
    return this;
  }
}

export const gitLabIssuesQR = (conn: SqlConnState, namespace: Namespace) =>
  conn.memoizableSqlResults(async () => {
    return await conn.SQL<
      {
        groupURL: string;
        groupPathComponent: string;
        groupName: string;
        groupNameQualified: string;
        groupDescription: string;
        projectPath: string;
        projectName: string;
        projectNameQualified: string;
        projectDescription: string;
        assignmentId: number;
        assignmentIID: number;
        projectURL: string;
        assignmentTitleHTML: string;
        assignmentDescriptionHTML: string;
        assignmentTitle: string;
        assignmentDescription: string;
        assignmentCreatedByUserName: string;
        assignmentCreatedByUserID: number;
        assignmentCreatedAt: Date;
        assignmentDueOn: Date;
        assignmentDueInDays: number;
        todosCount: number;
        viewedCount: number;
        completedCount: number;
        irrelevantCount: number;
        ignoredCount: number;
        authorizedUserIds: number[];
        assignedUserIds: number[];
        mentionedUserIds: number[];
        viewedByUserIds: number[];
        completedByUserIds: number[];
        irrelevantByUserIds: number[];
        // see GitLab PostgreSQL database schema at https://azimutt.app/new?sample=gitlab
      }[]
    >`WITH groups_cte (id) AS (
    /* Find all children of given group ID (e.g. 'Precision Knowledge Content') */
    WITH RECURSIVE childNS AS (
      SELECT ${namespace.id}::int4 AS id
      UNION ALL
      SELECT ns.id
      FROM namespaces AS ns
      JOIN childNS ON childNS.id = ns.parent_id
     ) SELECT id FROM childNS),
  projects_cte (id) AS (
    /* Find all projects in the descendants of given group ID (e.g. 'Precision Knowledge Content') */
    select id from projects p 
     where p.namespace_id in (select id from groups_cte)
  ),
  authorized_users_cte (project_id, user_id, access_level) as (
    /* Find all users who are authorized in projects_cte */
    select project_id, user_id, access_level 
      from project_authorizations pa
      where pa.project_id in (select id from projects_cte)
  ),
  issues_cte (project_id, issue_id, issue_iid, issue_author_id, title, title_html, description, description_html, created_at, due_date) AS (
    /* Find all issues in projects_cte */
    select project_id, i.id, iid, i.author_id, title, title_html, description, description_html, created_at, due_date 
      from issues i           
     where i.project_id in (select id from projects_cte) 
  ),
  mentioned_in_issues_cte (project_id, issue_id, user_id) AS (
    /* Find all mentionees in issues in projects_cte */
    select distinct project_id, i.issue_id, unnest(ium.mentioned_users_ids) as user_id
      from issue_user_mentions ium, issues_cte i
     where ium.issue_id = i.issue_id
  ),
  assigned_issues_cte (project_id, user_id, issue_id) AS (
    /* Find all assigned issues in projects_cte */
    select project_id, ia.user_id, ia.issue_id 
      from issue_assignees ia, issues_cte i
     where ia.issue_id = i.issue_id
  )
  select project_id as "projectId", 
         issue_id as "assignmentId", 
         issue_iid as "assignmentIID",
         issue_author_id as "authorId", 
         urls.level,
         urls.group_url as "groupURL",
         namespace.path as "groupPathComponent",
         namespace.name AS "groupName",
         namespace.description as "groupDescription",
         urls.group_name_qualified as "groupNameQualified",
         project.path as "projectPath",
         project.name as "projectName",
         project.description as "projectDescription",
         urls.project_url as "projectURL",
         urls.project_name_qualified as "projectNameQualified",
         assignment.title as "assignmentTitle",
         assignment.title_html as "assignmentTitleHTML",
         assignment.description as "assignmentDescription",
         assignment.description_html as "assignmentDescriptionHTML",
         assignment.created_at AS "assignmentCreatedAt",
         author.name as "assignmentCreatedByUserName",
         author.id as "assignmentCreatedByUserID",
         assignment.due_date as "assignmentDueOn",
         extract('day' from date_trunc('day', assignment.due_date) - now()) AS "assignmentDueInDays", 
         counts.todos as "todosCount",
         counts.viewed as "viewedCount",
         counts.completed as "completedCount",
         counts.irrelevant as "irrelevantCount",
         (counts.todos - counts.viewed - counts.completed - counts.irrelevant) as "ignoredCount",             
         COALESCE(authorized.users, '[]') AS "authorizedUserIds",
         COALESCE(assigned.users, '[]') AS "assignedUserIds",
         COALESCE(mentioned.users, '[]') AS "mentionedUserIds",
         COALESCE(viewedBy.users, '[]') AS "viewedByUserIds",
         COALESCE(completedBy.users, '[]') AS "completedByUserIds",
         COALESCE(irrelevantBy.users, '[]') AS "irrelevantByUserIds"
    from issues_cte assignment
    LEFT JOIN projects Project ON assignment.project_id = Project.id 
    LEFT JOIN namespaces Namespace ON namespace_id = Namespace.id 
    LEFT JOIN users Author ON assignment.issue_author_id = Author.id
    CROSS JOIN LATERAL(
      WITH RECURSIVE recursiveNS (id, level, path_component, abs_path, name_component, qualified_name) AS (
          SELECT  id, 0, path, path::text, name, name::text
          FROM    namespaces
          WHERE   parent_id is null
          UNION ALL
          SELECT  childNS.id, t0.level + 1, childNS.path, (t0.abs_path || '/' || childNS.path)::text, childNS.name, (t0.qualified_name || ${qualifiedComponentsDelim} || childNS.name)::text
          FROM    namespaces childNS
          INNER JOIN recursiveNS t0 ON t0.id = childNS.parent_id)
      SELECT  level, abs_path::text, abs_path::text || '/' || Project.path, qualified_name, qualified_name::text || ${qualifiedComponentsDelim} || Project.name
      FROM    recursiveNS
      WHERE   id = Namespace.id
    ) AS urls(level, group_url, project_url, group_name_qualified, project_name_qualified)      
    CROSS JOIN LATERAL(SELECT
      (select count(*) from todos where target_id = assignment.issue_id and target_type = 'Issue'),
      (select count(*) from award_emoji where awardable_id = assignment.issue_id and name='eyeglasses'),
      (select count(*) from award_emoji where awardable_id = assignment.issue_id and name='negative_squared_cross_mark'),
      (select count(*) from award_emoji where awardable_id = assignment.issue_id and name='white_check_mark')
    ) AS counts(todos, viewed, irrelevant, completed)
    LEFT JOIN LATERAL (
      SELECT json_agg(au.user_id) AS users
      FROM   authorized_users_cte au
      WHERE  au.project_id = assignment.project_id
    ) authorized ON true
    LEFT JOIN LATERAL (
      SELECT json_agg(ai.user_id) AS users
      FROM   assigned_issues_cte ai
      WHERE  ai.issue_id = assignment.issue_id
    ) assigned ON true
    LEFT JOIN LATERAL (
      SELECT json_agg(mii.user_id) AS users
      FROM   mentioned_in_issues_cte as mii
      WHERE  mii.issue_id = assignment.issue_id
    ) mentioned ON true
    LEFT JOIN LATERAL (
      select json_agg(aw.user_id) as users
        from award_emoji aw 
      where name = 'eyeglasses'
        and awardable_id = assignment.issue_id 
        and awardable_type='Issue'
    ) viewedBy ON true
    LEFT JOIN LATERAL (
      select json_agg(aw.user_id) as users
        from award_emoji aw 
      where name = 'white_check_mark'
        and awardable_id = assignment.issue_id 
        and awardable_type='Issue'
    ) completedBy ON true
    LEFT JOIN LATERAL (
      select json_agg(aw.user_id) as users
        from award_emoji aw 
      where name = 'negative_squared_cross_mark'
        and awardable_id = assignment.issue_id 
        and awardable_type='Issue'
    ) irrelevantBy ON true
   ORDER BY project.name, assignment.created_at`;
  }, `gitlab-gitLabIssues-${namespace.id}-${namespace.name}`);

export interface User {
  readonly id: number;
  readonly email: string;
  readonly name: string;
  readonly userName: string;
}

export interface UserAnalytics extends User {
  // readonly todosCount: number;
  // readonly openTodosCount: number;
  readonly authoredIssuesCount: number;
  readonly assignedIssuesCount: number;
  readonly mentionedInIssuesCount: number;
  readonly viewedReactionsCount: number;
  readonly irrelevantReactionsCount: number;
  readonly completedReactionsCount: number;
  readonly incompleteMentionsCount: number;
  readonly ignoredMentionsCount: number;
}

export interface Users {
  readonly namespace: Namespace;
  readonly users: UserAnalytics[];
}

export class TypicalUsers implements Users {
  static readonly singleton = (conn: SqlConnState, ns: Namespace) =>
    m.singleton(async () => {
      const users = new TypicalUsers(ns);
      await users.populate(conn);
      return users;
    });
  readonly users: UserAnalytics[] = [];

  constructor(readonly namespace: Namespace) {}

  async populate(conn: SqlConnState): Promise<Users> {
    const analytics = await m.singleton(
      gitLabUsersAnalyticsQR(conn, this.namespace),
    )();
    for (const user of analytics.sort((a: Any, b: Any) => {
      const aLC = a.name.toLocaleLowerCase();
      const bLC = b.name.toLocaleLowerCase();
      return aLC < bLC ? -1 : aLC > bLC ? 1 : 0;
    })) {
      this.users.push({
        id: user.id,
        userName: user.name,
        name: user.name,
        email: user.email,
        authoredIssuesCount: Number(user.authoredIssuesCount),
        assignedIssuesCount: Number(user.assignedIssuesCount),
        mentionedInIssuesCount: Number(user.mentionedInIssuesCount),
        viewedReactionsCount: Number(user.viewedReactionsCount),
        completedReactionsCount: Number(user.completedReactionsCount),
        irrelevantReactionsCount: Number(user.irrelevantReactionsCount),
        incompleteMentionsCount: Number(user.incompleteMentionsCount),
        ignoredMentionsCount: Number(user.ignoredMentionsCount),
      });
    }
    return this;
  }
}

export const gitLabUsersAnalyticsQR = (
  conn: SqlConnState,
  namespace: Namespace,
) =>
  conn.memoizableSqlResults(async () => {
    return await conn.SQL<
      {
        id: number;
        email: string;
        name: string;
        userName: string;
        // todosCount: number;
        // openTodosCount: number;
        authoredIssuesCount: number;
        assignedIssuesCount: number;
        mentionedInIssuesCount: number;
        viewedReactionsCount: number;
        irrelevantReactionsCount: number;
        completedReactionsCount: number;
        incompleteMentionsCount: number;
        ignoredMentionsCount: number;
        // see GitLab PostgreSQL database schema at https://azimutt.app/new?sample=gitlab
      }[]
    >`WITH groups_cte (id) AS (
    /* Find all children of given group ID (e.g. 'Precision Knowledge Content') */
    WITH RECURSIVE childNS AS (
      SELECT ${namespace.id}::int4 AS id
      UNION ALL
      SELECT ns.id
      FROM namespaces AS ns
      JOIN childNS ON childNS.id = ns.parent_id
     ) SELECT id FROM childNS),
    projects_cte (id) AS (
      /* Find all projects in the descendants of given group ID (e.g. 'Precision Knowledge Content') */
      select id from projects p 
      where p.namespace_id in (select id from groups_cte)
    ),
    issues_cte (project_id, issue_id, issue_author_id) AS (
      /* Find all issues in projects_cte */
      select project_id, i.id, i.author_id 
        from issues i           
      where i.project_id in (select id from projects_cte) 
    ),
    mentioned_in_issues_cte (project_id, issue_id, user_id) AS (
      /* Find all assigned issues in projects_cte */
      select distinct project_id, i.issue_id, unnest(ium.mentioned_users_ids) as user_id
        from issue_user_mentions ium, issues_cte i
      where ium.issue_id = i.issue_id
    ),
    assigned_issues_cte (project_id, user_id, issue_id) AS (
      /* Find all assigned issues in projects_cte */
      select project_id, ia.user_id, ia.issue_id 
        from issue_assignees ia, issues_cte i
      where ia.issue_id = i.issue_id
    )
    select u.id, 
          u.email, 
          u.name, 
          u.username as "userName",
          counts.authored_issues "authoredIssuesCount", 
          counts.assigned_issues "assignedIssuesCount", 
          counts.mentioned_in_issues "mentionedInIssuesCount",
          counts.viewed_reactions "viewedReactionsCount", 
          counts.irrelevant_reactions "irrelevantReactionsCount", 
          counts.completed_reactions "completedReactionsCount",
          (counts.mentioned_in_issues - counts.completed_reactions - counts.irrelevant_reactions) "incompleteMentionsCount",
          (counts.mentioned_in_issues - counts.viewed_reactions) "ignoredMentionsCount"
    from project_authorizations pa 
    join users u on u.id = pa.user_id
    cross join lateral (
      select (select count(*) from issues_cte where issue_author_id = u.id),
            (select count(*) from assigned_issues_cte where user_id = u.id),
            (select count(*) from mentioned_in_issues_cte miu where u.id = miu.user_id),
            (select count(*) from award_emoji aw, mentioned_in_issues_cte i where i.user_id = u.id and aw.user_id = i.user_id and awardable_id = i.issue_id and name='eyeglasses' and awardable_type='Issue'),
            (select count(*) from award_emoji aw, mentioned_in_issues_cte i where i.user_id = u.id and aw.user_id = i.user_id and awardable_id = i.issue_id and name='negative_squared_cross_mark' and awardable_type='Issue'),
            (select count(*) from award_emoji aw, mentioned_in_issues_cte i where i.user_id = u.id and aw.user_id = i.user_id and awardable_id = i.issue_id and name='white_check_mark' and awardable_type='Issue')
      ) as counts(authored_issues, assigned_issues, mentioned_in_issues, viewed_reactions, irrelevant_reactions, completed_reactions)
    where pa.project_id in (select id from projects_cte)
    group by u.id, counts.authored_issues, counts.assigned_issues, counts.mentioned_in_issues,
          counts.viewed_reactions, counts.irrelevant_reactions, counts.completed_reactions`;
  }, `gitlab-gitLabUsersAnalytics-${namespace.id}-${namespace.name}`);
