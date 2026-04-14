import type { FileNode } from "@/components/ui/file-tree";
import {
  KNOWLEDGE_DOCS,
  TREE_ROOT_ORDER,
  groupDocsForTree,
  groupOtherCategoryDocs,
} from "@/data/knowledge-mock";

/** 将知识库文档转为 FileTree 数据（根：项目资料 / 家族治理…） */
export function buildKnowledgeFileTreeData(): FileNode[] {
  const roots: FileNode[] = [];

  for (const root of TREE_ROOT_ORDER) {
    if (root === "项目资料") {
      const byProject = groupDocsForTree(KNOWLEDGE_DOCS);
      const projectNodes: FileNode[] = [];

      for (const [projectName, folderMap] of byProject.entries()) {
        const subFolders: FileNode[] = [];
        for (const [folder, docs] of folderMap.entries()) {
          subFolders.push({
            name: folder,
            type: "folder",
            children: docs.map((d) => ({
              id: d.id,
              name: d.title,
              type: "file" as const,
            })),
          });
        }
        projectNodes.push({
          name: projectName,
          type: "folder",
          children: subFolders,
        });
      }

      roots.push({
        name: root,
        type: "folder",
        children: projectNodes,
      });
    } else {
      const gm = groupOtherCategoryDocs(KNOWLEDGE_DOCS, root);
      const folderNodes: FileNode[] = [];
      for (const [folder, docs] of gm.entries()) {
        folderNodes.push({
          name: folder,
          type: "folder",
          children: docs.map((d) => ({
            id: d.id,
            name: d.title,
            type: "file" as const,
          })),
        });
      }
      roots.push({
        name: root,
        type: "folder",
        children: folderNodes,
      });
    }
  }

  return roots;
}
