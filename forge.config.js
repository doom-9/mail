module.exports = {
  packagerConfig: {
    // osxSign: {},
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-dmg",
      config: {},
    },
  ],
  publishers: [
    // {
    //   name: "@electron-forge/publisher-github",
    //   config: {
    //     repository: {
    //       owner: "doom-9",
    //       name: "mail",
    //     },
    //     authToken: "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",
    //   },
    // },
  ],
};
