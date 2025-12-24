/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2320651517")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"teacher\"",
    "deleteRule": "@request.auth.role = \"teacher\"",
    "updateRule": "@request.auth.role = \"teacher\"",
    "viewRule": "@request.auth.id = student.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2320651517")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
