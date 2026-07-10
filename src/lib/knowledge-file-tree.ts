import type { FileNode } from "@/components/ui/file-tree";
import type { ApiKnowledgeDocument } from "@/lib/api-client";

/** 按项目分组构建知识库目录树 */
export function buildKnowledgeFileTreeFromCatalog(
  documents: ApiKnowledgeDocument[],
  projects: { id: string; name: string }[],
): FileNode[] {
  const byProject = new Map<string, ApiKnowledgeDocument[]>();
  for (const doc of documents) {
    const list = byProject.get(doc.projectId) ?? [];
    list.push(doc);
    byProject.set(doc.projectId, list);
  }

  const projectNodes: FileNode[] = [];
  for (const project of projects) {
    const docs = byProject.get(project.id) ?? [];
    if (docs.length === 0) continue;

    const packageDocs = docs.filter((d) => d.scope === "package");
    const sessionDocs = docs.filter((d) => d.scope === "session");
    const children: FileNode[] = [];

    if (packageDocs.length > 0) {
      children.push({
        name: "项目资料包",
        type: "folder",
        children: packageDocs.map((d) => ({
          id: d.id,
          name: d.filename,
          type: "file" as const,
        })),
      });
    }
    if (sessionDocs.length > 0) {
      children.push({
        name: "对话附件",
        type: "folder",
        children: sessionDocs.map((d) => ({
          id: d.id,
          name: d.filename,
          type: "file" as const,
        })),
      });
    }

    projectNodes.push({
      name: project.name,
      type: "folder",
      children,
    });
  }

  if (projectNodes.length === 0) {
    return [
      {
        name: "暂无文档",
        type: "folder",
        children: [],
      },
    ];
  }

  return [
    {
      name: "在管项目",
      type: "folder",
      children: projectNodes,
    },
  ];
}
