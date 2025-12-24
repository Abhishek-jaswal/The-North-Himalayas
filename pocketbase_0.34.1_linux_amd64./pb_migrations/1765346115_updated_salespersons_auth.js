/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2457413599")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_hF82Dclatg` ON `salespersons` (`password`)",
      "CREATE UNIQUE INDEX `idx_sM6Hr0sMp3` ON `salespersons` (`email`)",
      "CREATE UNIQUE INDEX `idx_tokenKey_1ctb216n43` ON `salespersons` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_1ctb216n43` ON `salespersons` (`email`) WHERE `email` != ''"
    ],
    "name": "salespersons"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2457413599")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_hF82Dclatg` ON `salespersons_auth` (`password`)",
      "CREATE UNIQUE INDEX `idx_sM6Hr0sMp3` ON `salespersons_auth` (`email`)",
      "CREATE UNIQUE INDEX `idx_tokenKey_1ctb216n43` ON `salespersons_auth` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_1ctb216n43` ON `salespersons_auth` (`email`) WHERE `email` != ''"
    ],
    "name": "salespersons_auth"
  }, collection)

  return app.save(collection)
})
