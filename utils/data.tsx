import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      firstName: "Kévin",
      lastName: "Ducrocq",
      email: "kducrocq.dev@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      firstName: "Aurélien",
      lastName: "Courtial",
      email: "aurelien.courtial@yopmail.fr",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  categories: [
    { id: 1, name: "Shirts" },
    { id: 2, name: "Pants" },
  ],
  products: [
    {
      id: 1,
      name: "Free shirt",
      slug: "free-shirt",
      categories: [1],
      image: "/images/shirt1.jpg",
      price: 70,
      brand: "Nike",
      rating: 4.5,
      numReviews: 8,
      countInStock: 20,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et accusamus ullam tenetur rerum eos, quis blanditiis aliquam in sapiente iste vel, earum aperiam perferendis aut totam nemo culpa maxime eum.",
    },
    {
      id: 2,
      name: "Fit shirt",
      slug: "fit-shirt",
      categories: [1],
      image: "/images/shirt2.jpg",
      price: 50,
      brand: "Adidas",
      rating: 3.5,
      numReviews: 5,
      countInStock: 10,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et accusamus ullam tenetur rerum eos, quis blanditiis aliquam in sapiente iste vel, earum aperiam perferendis aut totam nemo culpa maxime eum.",
    },
    {
      id: 3,
      name: "Slim shirt",
      slug: "slim-shirt",
      categories: [1],
      image: "/images/shirt3.jpg",
      price: 30,
      brand: "Puma",
      rating: 4,
      numReviews: 7,
      countInStock: 15,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et accusamus ullam tenetur rerum eos, quis blanditiis aliquam in sapiente iste vel, earum aperiam perferendis aut totam nemo culpa maxime eum.",
    },
    {
      id: 4,
      name: "Golf pants",
      slug: "golf-pants",
      categories: [2],
      image: "/images/pants1.jpg",
      price: 90,
      brand: "Oliver",
      rating: 2,
      numReviews: 6,
      countInStock: 60,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et accusamus ullam tenetur rerum eos, quis blanditiis aliquam in sapiente iste vel, earum aperiam perferendis aut totam nemo culpa maxime eum.",
    },
    {
      id: 5,
      name: "Fit pants",
      slug: "fit-pants",
      categories: [2],
      image: "/images/pants2.jpg",
      price: 45,
      brand: "Pull & Bear",
      rating: 4.3,
      numReviews: 6,
      countInStock: 30,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et accusamus ullam tenetur rerum eos, quis blanditiis aliquam in sapiente iste vel, earum aperiam perferendis aut totam nemo culpa maxime eum.",
    },
    {
      id: 6,
      name: "Classic pants",
      slug: "classic-pants",
      categories: [2],
      image: "/images/pants3.jpg",
      price: 58,
      brand: "Devred",
      rating: 3.8,
      numReviews: 4,
      countInStock: 22,
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et accusamus ullam tenetur rerum eos, quis blanditiis aliquam in sapiente iste vel, earum aperiam perferendis aut totam nemo culpa maxime eum.",
    },
  ],
};

export default data;
