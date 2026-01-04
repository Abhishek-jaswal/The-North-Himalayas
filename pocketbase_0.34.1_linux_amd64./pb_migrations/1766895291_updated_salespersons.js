/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2457413599")

  // update collection data
  unmarshal({
    "listRule": "@request.method != \"\"",
    "viewRule": "@request.method != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2457413599")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\"\n",
    "viewRule": "@request.auth.id != \"\"\n"
  }, collection)

  return app.save(collection)
})
