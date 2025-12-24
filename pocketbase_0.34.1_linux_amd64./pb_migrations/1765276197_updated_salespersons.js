/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_771962462")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"\n",
    "deleteRule": "@request.auth.id != \"\"\n",
    "updateRule": "@request.auth.id != \"\"\n",
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_771962462")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
