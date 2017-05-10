"""
Parse random forests into a json
parse() and tree_json() are referenced from: https://github.com/tristaneljed/Decision-Tree-Visualization-Spark/
"""

import os
import sys
import json

# Parser
def parse(lines):
    block = []
    while lines :
	if lines[0].startswith('If'):
	    bl = ' '.join(lines.pop(0).split()[1:]).replace('(', '').replace(')', '')
	    block.append({'name':bl, 'children':parse(lines)})
	    if lines[0].startswith('Else'):
		be = ' '.join(lines.pop(0).split()[1:]).replace('(', '').replace(')', '')
		block.append({'name':be, 'children':parse(lines)})
	elif not lines[0].startswith(('If','Else')):
	    block2 = lines.pop(0)
	    block.append({'name':block2})
	else:
	    break	
	return block
	
# Convert Tree to JSON
def tree_json(trees, web_dir):
    num = 0
    for tree in trees:
        data = []
        for line in tree.splitlines() : 
	    if line.strip():
	        line = line.strip()
	        data.append(line)
	    else : break
	    if not line : break
        res = []
        res.append({'name':'Root', 'children':parse(data[1:])})
        with open('%s/tree%s.json' % (web_dir, num), 'w') as outfile:
	    json.dump(res[0], outfile)
        num += 1

if __name__ == "__main__":
    model_file = sys.argv[1]
    web_dir = sys.argv[2]
    trees = []
    with open(model_file) as f:
        tree = ""
        for l in f:
            if l.strip().startswith("Tree "):
                if tree != "":
                    trees.append(tree)
                tree = ""
                continue

            tmp = l.strip()
            if not tmp.startswith("If ") and not tmp.startswith("Else "):
                continue

            tree += l

        if tree != "":
            trees.append(tree)

    tree_json(trees, web_dir)
