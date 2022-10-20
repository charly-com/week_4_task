import FileTree from "./fileTree";

export function createFileTree(input) {
 

  const fileTree = new FileTree();
  input.sort((a, b) => a.id - b.id);
  for (const inputNode of input) {
    input[0].parentId = null;
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;
    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}
