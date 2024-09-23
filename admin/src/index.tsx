import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import InputIcon from './components/InputIcon';
import getTrad from './utils/getTrad';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.customFields.register({
      name: "nanoid",
      pluginId,
      type: "string",
      intlLabel: {
        id: getTrad("form.label"),
        defaultMessage: "NanoID",
      },
      intlDescription: {
        id: getTrad("form.description"),
        defaultMessage: "Generates a NanoID",
      },
      //icon: InputIcon,
      components: {
        Input: async () => import(/* webpackChunkName: "input-nanoid-component" */ "./components/Input"),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'options.idLength',
                type: 'checkbox-with-number-field',
                value: 21,
                intlLabel: {
                  id: getTrad('settings.nanoid.idLength.heading'),
                  defaultMessage: 'Length',
                },
                description: {
                  id: getTrad("settings.nanoid.idLength.description"),
                  defaultMessage: 'The length of the NanoID to generate',
                },
              },
            ],
          },
        ],
        validator: () => {},
      },
    });

    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data,
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
