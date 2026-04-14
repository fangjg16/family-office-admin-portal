import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FileNode {
  id?: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

export interface FileTreeProps {
  data: FileNode[];
  className?: string;
  /** plain：无仿窗口标题栏，适合已嵌在外层「文档目录」等卡片内 */
  variant?: "explorer" | "plain";
  /** variant=explorer 时顶部标题 */
  title?: string;
  selectedId?: string | null;
  onFileSelect?: (id: string) => void;
}

interface FileItemProps {
  node: FileNode;
  depth: number;
  keyPath: string;
  selectedId?: string | null;
  onFileSelect?: (id: string) => void;
}

function FolderOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9l-1.42-1.42A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function FileOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function FileItem({
  node,
  depth,
  keyPath,
  selectedId,
  onFileSelect,
}: FileItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFolder = node.type === "folder";
  const hasChildren = isFolder && node.children && node.children.length > 0;
  const isSelected = Boolean(node.id && selectedId === node.id);

  const handleRowClick = () => {
    if (isFolder) {
      setIsOpen((o) => !o);
    } else if (node.id) {
      onFileSelect?.(node.id);
    }
  };

  const iconMuted = cn(
    "text-muted-foreground transition-colors duration-200",
    (isHovered || (!isFolder && isSelected)) && "text-foreground"
  );

  /** 根层主文件夹/文件略大，子层级缩小以区分层次 */
  const isRoot = depth === 0;
  const rowIconClass = cn(
    isRoot ? "h-[18px] w-[18px]" : "h-[14px] w-[14px]"
  );
  const chevronWrapClass = cn(
    "flex shrink-0 items-center justify-center transition-transform duration-200 ease-out",
    isRoot ? "h-4 w-4" : "h-3.5 w-3.5"
  );
  const folderFileWrapClass = cn(
    "flex shrink-0 items-center justify-center rounded transition-transform duration-200",
    isRoot ? "h-5 w-5" : "h-4 w-4"
  );

  return (
    <div className="w-full min-w-0 select-none">
      <div
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRowClick();
          }
        }}
        className={cn(
          "group relative flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5",
          "transition-colors duration-150 ease-out",
          !isSelected && isHovered && "bg-muted/60",
          isSelected && "bg-muted",
          isSelected && isHovered && "bg-muted/90"
        )}
        onClick={handleRowClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
      >
        <div
          className={cn(
            chevronWrapClass,
            isFolder && isOpen && "rotate-90"
          )}
        >
          {isFolder ? (
            <svg
              width="6"
              height="8"
              viewBox="0 0 6 8"
              fill="none"
              className={cn(
                "transition-colors duration-200",
                !isRoot && "scale-[0.92]",
                isHovered ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <path
                d="M1 1L5 4L1 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span
              className={cn("block shrink-0", isRoot ? "h-4 w-4" : "h-3.5 w-3.5")}
              aria-hidden
            />
          )}
        </div>

        <div
          className={cn(
            folderFileWrapClass,
            isHovered && "scale-[1.02]"
          )}
        >
          {isFolder ? (
            <FolderOutlineIcon className={cn(iconMuted, rowIconClass)} />
          ) : (
            <FileOutlineIcon className={cn(iconMuted, rowIconClass)} />
          )}
        </div>

        <span
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1 text-sm transition-colors duration-200",
            isFolder
              ? isHovered
                ? "text-foreground"
                : "text-foreground/95"
              : isSelected || isHovered
                ? "text-foreground"
                : "text-muted-foreground"
          )}
        >
          <span className="min-w-0 truncate">{node.name}</span>
          {isFolder && (
            <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
              ({node.children?.length ?? 0})
            </span>
          )}
        </span>

        <div
          className={cn(
            "absolute right-2 h-1.5 w-1.5 rounded-full bg-primary transition-all duration-200",
            isHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
      </div>

      {hasChildren && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {node.children!.map((child, index) => (
            <FileItem
              key={`${keyPath}/${child.name}-${index}`}
              node={child}
              depth={depth + 1}
              keyPath={`${keyPath}/${child.name}`}
              selectedId={selectedId}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({
  data,
  className,
  variant = "plain",
  title = "知识库",
  selectedId,
  onFileSelect,
}: FileTreeProps) {
  const explorer = variant === "explorer";

  return (
    <div
      className={cn(
        "font-sans text-sm",
        explorer &&
          "rounded-xl border border-border/60 bg-muted/30 p-3 shadow-inner",
        className
      )}
    >
      {explorer && (
        <div className="mb-2 flex items-center gap-2 border-b border-border/40 pb-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
          </div>
          <span className="ml-1 text-xs text-muted-foreground">{title}</span>
        </div>
      )}

      <div className="w-full min-w-0 space-y-0.5">
        {data.map((node, index) => (
          <FileItem
            key={`${node.name}-${index}`}
            node={node}
            depth={0}
            keyPath={node.name}
            selectedId={selectedId}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}
