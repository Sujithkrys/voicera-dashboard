with open("main.py", "r") as f:
    content = f.read()

import_line = "from app.api.v1.routes.usage import router as usage_router\nfastapi_app.include_router(usage_router, prefix=\"/api/v1\")"

if "usage_router" not in content:
    content += "\n" + import_line + "\n"
    with open("main.py", "w") as f:
        f.write(content)
    print("Added usage_router to main.py")
else:
    print("usage_router already exists")
