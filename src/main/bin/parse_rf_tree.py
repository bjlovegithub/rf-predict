"""
Parse random forests into a json
parse() and tree_json() are referenced from: https://github.com/tristaneljed/Decision-Tree-Visualization-Spark/
"""

import os
import sys
import json

name_map = {
    "feature 0 ": "industry",
    "feature 1 ": "region",
    "feature 2 ": "social_type",
    "feature 3 ": "iphone_cnt",
    "feature 4 ": "android_cnt",
    "feature 5 ": "pc_cnt",
    "feature 6 ": "ipad_cnt",
    "feature 7 ": "other_cnt",
    "feature 8 ": "cus_tpl_cnt",
    "feature 9 ": "down_tpl_cnt",
    "feature 10 ": "share_tpl_cnt",
    "feature 11 ": "inspect_cnt",
    "feature 12 ": "view_report_cnt",
    "feature 13 ": "share_report_cnt",
    "feature 14 ": "cancel_inspect_cnt",
    "feature 15 ": "gender",
    "feature 16 ": "age"
}

def normalize(s):
    for k, v in name_map.iteritems():
        if s.startswith(k):
            return s.replace(k, v)
    return s

# Parser
def parse(lines):
    block = []
    while lines :
	if lines[0].startswith('If'):
	    bl = ' '.join(lines.pop(0).split()[1:]).replace('(', '').replace(')', '')
            bl = normalize(bl) + ' '
	    block.append({'name':bl, 'children':parse(lines)})
	    if lines[0].startswith('Else'):
		be = ' '.join(lines.pop(0).split()[1:]).replace('(', '').replace(')', '')
                be = normalize(be) + ' '
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
