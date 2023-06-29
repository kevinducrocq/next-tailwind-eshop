import AdminMenu from "@/components/AdminMenu";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import fetchProductById from "@/domain/admin/fetchProductById";
import updateProduct from "@/domain/admin/updateProduct";
import fetchCategories from "@/domain/categories/fetchCategories";
import { getError } from "@/utils/error";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      state;
  }
}

export default function AdminProductEditPage() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [product, setProduct] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        fetchProductById(productId, setProduct);

        fetchCategories(setCategories);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: product,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [productId, setValue]);

  useEffect(() => {
    try {
      setValue("name", product.name);
      setValue("slug", product.slug);
      setValue("price", product.price);
      setValue("image", product.image);
      setValue("brand", product.brand);
      setValue("category", product.category?.id);
      setValue("countInStock", product.countInStock);
      setValue("description", product.description);
    } catch (err) {
      getError(err);
    }
  }, [
    product.slug,
    product.price,
    product.image,
    product.brand,
    product.category,
    product.countInStock,
    product.description,
    setValue,
    product.name,
  ]);

  const submitHandler = async ({
    name,
    slug,
    price,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      const updatedProduct = await updateProduct(
        productId,
        name,
        slug,
        image,
        price,
        brand,
        selectedCategoryId,
        countInStock,
        description
      );

      if (updatedProduct) {
        if (updatedProduct.error) {
          toast.error(updatedProduct.error);
        } else {
          setProduct(updatedProduct);
          toast.success("Informations du produit mises à jour avec succès !");
        }
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };

  console.log("FRONT", selectedCategoryId);

  return (
    <Layout title={`Admin - Edition produit : ${product.name}`}>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-4 md:gap5'>
          <AdminMenu />
          <div className='md:col-span-3'>
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className='alert-error'>{error}</div>
            ) : (
              <form
                className='mx-auto max-w-screen-md'
                onSubmit={handleSubmit(submitHandler)}
              >
                <h1 className='mb-4 text-xl'>
                  Edition du produit : {product.name}
                </h1>
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
                  <label htmlFor='slug'>Slug</label>
                  <input
                    name='slug'
                    type='text'
                    className='w-full'
                    id='slug'
                    {...register("slug", {
                      required: "Entrez le slug du produit",
                    })}
                  />
                  {errors.slug && (
                    <div className='text-red-500'>{errors.slug.message}</div>
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
                    type='text'
                    className='w-full'
                    id='image'
                    {...register("image", {
                      required: "Entrez l'image' du produit",
                    })}
                  />
                  {errors.image && (
                    <div className='text-red-500'>{errors.image.message}</div>
                  )}
                </div>
                <div className='mb-4 '>
                  <label htmlFor='category'>Catégorie</label>
                  <br />
                  <select
                    name='category'
                    id='category'
                    className='w-full'
                    onChange={handleCategoryChange}
                  >
                    {categories.map((mappedCategory) => (
                      <option
                        key={mappedCategory.id}
                        value={mappedCategory.id}
                        defaultValue={
                          mappedCategory.name === product.category?.name
                        }
                      >
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
                  <button className='primary-button' disabled={loadingUpdate}>
                    {loadingUpdate ? (
                      <Spinner hScreen={false} size='10' />
                    ) : (
                      "Mettre à jour"
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
AdminProductEditPage.auth = { adminOnly: true };
