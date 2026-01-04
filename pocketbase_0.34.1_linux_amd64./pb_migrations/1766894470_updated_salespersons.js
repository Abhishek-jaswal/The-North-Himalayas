/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2457413599")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "date333095869",
    "max": "",
    "min": "",
    "name": "last_active",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2457413599")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "date333095869",
    "max": "",
    "min": "",
    "name": "ast_active",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
