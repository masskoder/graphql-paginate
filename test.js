const graphqlPagination = require("./index");

describe("pagination helper", () => {
  const models = [
    {
      id: 1,
      name: "user 1"
    },
    {
      id: 2,
      name: "user 2"
    },
    {
      id: 3,
      name: "user 3"
    },
    {
      id: 4,
      name: "user 4"
    },
    {
      id: 5,
      name: "user 5"
    }
  ];
  const mockModel = {
    findAll: jest.fn(() => models),
    count: jest.fn(() => models.length)
  };

  it("call skip , first and limit args ", async () => {
    const args = {
      skip: 2,
      first: 2,
      LIMIT: 2
    };
    const pagination = await graphqlPagination(mockModel, args, "id");

    expect(pagination).toMatchSnapshot();
  });
});
