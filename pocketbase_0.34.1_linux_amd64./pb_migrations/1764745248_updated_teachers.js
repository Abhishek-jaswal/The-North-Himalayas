/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = user.id",
    "viewRule": "@request.auth.id = user.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2907260911")

  // update collection data
  unmarshal({
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
