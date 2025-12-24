/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_771962462")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_BG8fSg5qV0` ON `salespersons` (`password`)",
      "CREATE UNIQUE INDEX `idx_G09t180kno` ON `salespersons` (`email`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_771962462")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_BG8fSg5qV0` ON `salespersons` (`password`)"
    ]
  }, collection)

  return app.save(collection)
})
