module.exports = {
  packagerConfig: {
    osxSign: {
      identity:
        "Developer ID Application: Root Sports Investment (Beijing) Co., Ltd.",
    },
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
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "doom-9",
          name: "mail",
        },
        authToken: "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",
        draft: true,
        prerelease: false,
      },
    },
  ],
};
