/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2072519612")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_771962462",
    "hidden": false,
    "id": "relation1945864452",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "last_assigned",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json3823124818",
    "maxSize": 0,
    "name": "region_map",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2072519612")

  // remove field
  collection.fields.removeById("relation1945864452")

  // remove field
  collection.fields.removeById("json3823124818")

  return app.save(collection)
})
