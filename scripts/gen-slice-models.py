"""Generate Slice Machine model.json files from the compact specs in slice-specs.py.
Run: python3 scripts/gen-slice-models.py   (only writes the slices listed in the spec file)"""
import json, os, re, importlib.util, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location("specs", os.path.join(ROOT, "scripts", "slice-specs.py"))
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

ICONS = mod.ICONS

def label(k): return k.replace("_", " ").capitalize()

def field(key, t):
    if isinstance(t, dict):
        return {"type": "Group", "config": {"label": label(key), "repeat": True,
                "fields": {k: field(k, v) for k, v in t.items()}}}
    name, _, arg = t.partition(":")
    if name == "Text": return {"type": "Text", "config": {"label": label(key), "placeholder": arg}}
    if name == "Title": return {"type": "StructuredText", "config": {"label": label(key), "allowTargetBlank": True, "single": "heading2,em"}}
    if name == "H1": return {"type": "StructuredText", "config": {"label": label(key), "allowTargetBlank": True, "single": "heading1,em"}}
    if name == "Para": return {"type": "StructuredText", "config": {"label": label(key), "allowTargetBlank": True, "single": "paragraph,em"}}
    if name == "Rich": return {"type": "StructuredText", "config": {"label": label(key), "allowTargetBlank": True,
            "multi": arg or "paragraph,strong,em,hyperlink,list-item,o-list-item"}}
    if name == "Image": return {"type": "Image", "config": {"label": label(key), "constraint": {}, "thumbnails": []}}
    if name == "Link": return {"type": "Link", "config": {"label": label(key), "select": None, "allowText": True,
            "allowTargetBlank": True, "repeat": False, "variants": ["Primary", "Secondary"]}}
    if name == "Bool": return {"type": "Boolean", "config": {"label": label(key), "default_value": arg == "true"}}
    if name == "Number": return {"type": "Number", "config": {"label": label(key), "placeholder": arg}}
    if name == "Icon": return {"type": "Select", "config": {"label": label(key), "options": ICONS, "default_value": arg or ICONS[0]}}
    if name == "Select":
        opts = arg.split(",")
        return {"type": "Select", "config": {"label": label(key), "options": opts, "default_value": opts[0]}}
    raise ValueError(t)

for sid, s in mod.SLICES.items():
    folder = os.path.join(ROOT, "src", "slices", s["folder"])
    os.makedirs(folder, exist_ok=True)
    variations = []
    for vid, v in s["variations"].items():
        variations.append({"id": vid, "type": "SharedSliceVariation", "name": v["name"], "docURL": "...",
            "version": "initial", "description": v.get("description", v["name"]), "imageUrl": "",
            "primary": {k: field(k, t) for k, t in v["primary"].items()}, "items": {}})
    model = {"id": sid, "type": "SharedSlice", "name": s["folder"], "description": s["description"], "variations": variations}
    with open(os.path.join(folder, "model.json"), "w") as f: json.dump(model, f, indent=2); f.write("\n")
    print("wrote", s["folder"])
