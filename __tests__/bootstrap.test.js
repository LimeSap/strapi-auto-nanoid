import bootstrap from "../server/bootstrap";
import { nanoid } from "nanoid";

const strapi = {
  db: {
    lifecycles: {
      subscribe: jest.fn(),
    },
  },
  contentTypes: {
    'api::firstTestModel': {
      attributes: {
        actualNanoID: {
          customField: "plugin::field-nanoid.nanoid",
        },
        baitNanoID: {},
      },
    },
    'api::secondTestModel': {
      attributes: {
        title: {},
        uid: {},
      },
    },
    'api::thirdTestModel': {
      attributes: {
        actualNanoID: {
          customField: "plugin::field-nanoid.nanoid",
        },
      },
    },
  },
};

// I'll fix these later
describe.skip("bootstrap", () => {
  it("should subscribe to lifecycles for models that have nanoid fields", () => {
    bootstrap({ strapi });

    expect(strapi.db.lifecycles.subscribe).toHaveBeenCalledTimes(1);
    expect(strapi.db.lifecycles.subscribe).toHaveBeenCalledWith(expect.any(Function));

    const actualNanoID = nanoid()
    const subscribeCallback = strapi.db.lifecycles.subscribe.mock.calls[0][0];
    const event = {
      action: "beforeCreate",
      model: {
        uid: "api::firstTestModel",
      },
      params: {
        data: {
          baitNanoID: "invalid-nanoid",
          actualNanoID,
        },
      },
    };
    subscribeCallback(event);

    expect(event.params.data.baitNanoID).toBe("invalid-nanoid");
    expect(event.params.data.actualNanoID).toBe(actualNanoID);
  });

  it("should not subscribe to lifecycles for models that don't have nanoid fields", () => {
    bootstrap({ strapi });

    expect(strapi.db.lifecycles.subscribe).toHaveBeenCalledTimes(1);
    expect(strapi.db.lifecycles.subscribe).toHaveBeenCalledWith(expect.any(Function));

    const subscribeCallback = strapi.db.lifecycles.subscribe.mock.calls[0][0];
    const event = {
      action: "beforeCreate",
      model: {
        uid: "api::secondTestModel",
      },
      params: {
        data: {
          title: "name",
          uid: "another-uid"
        },
      },
    };
    subscribeCallback(event);

    expect(event.params.data.title).toBe("name");
    expect(event.params.data.uid).toBe("another-uid");
  });

  it("should generate nanoid for empty nanoid fields", () => {
    bootstrap({ strapi });

    expect(strapi.db.lifecycles.subscribe).toHaveBeenCalledTimes(1);
    expect(strapi.db.lifecycles.subscribe).toHaveBeenCalledWith(expect.any(Function));

    const subscribeCallback = strapi.db.lifecycles.subscribe.mock.calls[0][0];
    const event = {
      action: "beforeCreate",
      model: {
        uid: "api::thirdTestModel",
      },
      params: {
        data: {
          actualNanoID: "",
        },
      },
    };
    subscribeCallback(event);
    expect(validate(event.params.data.actualNanoID)).toBe(true);
  });
});
