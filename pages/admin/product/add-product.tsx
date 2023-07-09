import AdminMenu from "@/components/AdminMenu";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import addProduct from "@/domain/admin/addProduct";
import uploadImage from "@/domain/admin/uploadImage";
import fetchCategories from "@/domain/categories/fetchCategories";
import { getError } from "@/utils/error";
import { slugify } from "@/utils/slugify";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "ADD_REQUEST":
      return { ...state, loadingAdd: true, error: "" };
    case "ADD_SUCCESS":
      return { ...state, loadingAdd: false, error: "" };
    case "ADD_FAIL":
      return {
        ...state,
        loadingAdd: false,
        error: action.payload,
      };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, error: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, error: "" };
    case "UPLOAD_FAIL":
      return {
        ...state,
        loadingUpload: false,
        error: action.payload,
      };
    default:
      state;
  }
}

export default function AdminProductAddPage() {
  const router = useRouter();
  const [{ error, loadingAdd }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const categoryRef = useRef(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // State pour l'aperçu de l'image

  useEffect(() => {
    try {
      fetchCategories(setCategories);
    } catch (err) {
      getError(err);
    }
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);

    const resizedImage = await new Promise((resolve) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const maxWidth = 800; // Définissez la largeur maximale souhaitée pour l'image redimensionnée
        const maxHeight = 800; // Définissez la hauteur maximale souhaitée pour l'image redimensionnée
        const resizedDataUrl = ImageResizer.resize(img, maxWidth, maxHeight);
        resolve(resizedDataUrl);
      };
    });

    setImagePreview(resizedImage);
  };

  const submitHandler = async ({
    name,
    price,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: "ADD_REQUEST" });

      const file = image[0]; // Récupérer le fichier d'image
      const uniqueName = generateUniqueName(file.name); // Générer un nom unique pour l'image

      // Envoyer l'image redimensionnée avec le nom unique au serveur
      const response = await uploadImage(file, uniqueName);

      if (response.error) {
        toast.error(response.error);
      } else {
        const imagePath = response.path; // Chemin de l'image dans le dossier "uploads"

        // Enregistrer le chemin de l'image en base de données
        const newProduct = await addProduct(
          name,
          slugify(name),
          imagePath,
          price,
          brand,
          countInStock,
          description,
          selectedCategoryId
        );
        if (newProduct) {
          if (newProduct.error) {
            toast.error(newProduct.error);
          } else {
            dispatch({ type: "ADD_SUCCESS" });
            router.push("/admin/products");
          }
        }
      }
    } catch (err) {
      dispatch({ type: "ADD_FAIL", payload: getError(err) });
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };
  const generateUniqueName = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split(".").pop();
    const uniqueName = `${timestamp}-${randomString}.${extension}`;

    return uniqueName;
  };

  return (
    <Layout title={`Admin - Ajout produit`}>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-6 md:gap-2'>
          <div className='md:col-span-1'>
            <AdminMenu />
          </div>
          <div className='md:col-span-5'>
            {loadingAdd ? (
              <Spinner />
            ) : error ? (
              <div className='alert-error'>{error}</div>
            ) : (
              <form
                className='mx-auto max-w-screen-lg'
                onSubmit={handleSubmit(submitHandler)}
              >
                <h1 className='mb-4 text-xl'>Ajouter un produit</h1>
                <div className='mb-4 '>
                  <label htmlFor='name'>Nom</label>
                  <input
                    name='name'
                    type='text'
                    className='w-full'
                    id='name'
                    {...register("name", {
                      required: "Entrez le nom du produit",
                    })}
                  />
                  {errors.name && (
                    <div className='text-red-500'>{errors.name.message}</div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='price'>Prix</label>
                  <input
                    name='price'
                    type='text'
                    className='w-full'
                    id='price'
                    {...register("price", {
                      required: "Entrez le prix du produit",
                    })}
                  />
                  {errors.price && (
                    <div className='text-red-500'>{errors.price.message}</div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='countInStock'>Stock</label>
                  <input
                    name='countInStock'
                    type='text'
                    className='w-full'
                    id='countInStock'
                    {...register("countInStock", {
                      required: "Entrez le stock du produit",
                    })}
                  />
                  {errors.countInStock && (
                    <div className='text-red-500'>
                      {errors.countInStock.message}
                    </div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='image'>Image</label>
                  <input
                    name='image'
                    type='file'
                    className='w-full'
                    id='image'
                    onChange={handleImageChange}
                    {...register("image", {
                      required: "Entrez l'image du produit",
                    })}
                  />
                  {errors.image && (
                    <div className='text-red-500'>{errors.image.message}</div>
                  )}
                </div>
                <div className='mb-4'>
                  {imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt='Image Preview' />
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='category'>Catégorie</label>
                  <br />
                  <select
                    name='category'
                    id='category'
                    className='w-full'
                    ref={categoryRef}
                    onChange={handleCategoryChange}
                  >
                    {categories.map((mappedCategory) => (
                      <option key={mappedCategory.id} value={mappedCategory.id}>
                        {mappedCategory.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className='text-red-500'>
                      {errors.category.message}
                    </div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='brand'>Marque</label>
                  <input
                    name='brand'
                    type='text'
                    className='w-full'
                    id='brand'
                    {...register("brand", {
                      required: "Entrez la marque du produit",
                    })}
                  />
                  {errors.brand && (
                    <div className='text-red-500'>{errors.brand.message}</div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    name='description'
                    type='text'
                    className='w-full'
                    id='description'
                    {...register("description", {
                      required: "Entrez la description du produit",
                    })}
                  />
                  {errors.description && (
                    <div className='text-red-500'>
                      {errors.description.message}
                    </div>
                  )}
                </div>
                <div className='mb-4'>
                  <button className='primary-button' disabled={loadingAdd}>
                    {loadingAdd ? (
                      <Spinner hScreen={false} size='30' />
                    ) : (
                      "Ajouter"
                    )}
                  </button>
                </div>
                <div className='mb-4'>
                  <Link href={`/admin/products`}>
                    <FontAwesomeIcon icon={faBackward} /> Retour
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
AdminProductAddPage.auth = { adminOnly: true };
