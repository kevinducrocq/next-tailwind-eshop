import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      firstName: "Ducrocq",
      lastName: "Kévin",
      email: "kducrocq.dev@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      firstName: "Courtial",
      lastName: "Aurélien",
      email: "aurelien.courtial@yopmail.fr",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Free shirt",
      slug: "free-shirt",
      category: "Shirts",
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
      name: "Fit shirt",
      slug: "fit-shirt",
      category: "Shirts",
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
      name: "Slim shirt",
      slug: "slim-shirt",
      category: "Shirts",
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
      name: "Golf pants",
      slug: "golf-pants",
      category: "Pants",
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
      name: "Fit pants",
      slug: "fit-pants",
      category: "Pants",
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
      name: "Classic pants",
      slug: "classic-pants",
      category: "Pants",
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
