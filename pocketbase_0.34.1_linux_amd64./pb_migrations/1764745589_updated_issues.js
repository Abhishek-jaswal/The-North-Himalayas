/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3983409869")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.role = \"admin\"",
    "viewRule": "@request.auth.role = \"admin\" || @request.auth.username = username"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3983409869")

  // update collection data
  unmarshal({
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
