/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2769025244")

  // update collection data
  unmarshal({
    "createRule": "@request.method != \"\"\n",
    "deleteRule": "@request.auth.id != \"\"\n",
    "listRule": "@request.method != \"\"\n",
    "updateRule": "@request.method != \"\"\n",
    "viewRule": "@request.method != \"\"\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2769025244")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
