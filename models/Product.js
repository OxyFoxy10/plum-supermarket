import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    reviewBy: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    review: {
        type: String,
        required: true,
    },
    size: {
        type: String,
    },
    style: {
        color: String,
        image: String,
    },
    fit: {
        type: String,
    },
    images: [],
    likes: [],
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code:{
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        category: {
            type: ObjectId,
            required: true,
            ref: "Category",
        },
        subCategories: [
            {
                type: ObjectId,
                ref: "SubCategory",
            },
        ],
        details: [
            {
                name: String,
                value: String,
            }
        ],
        questions: [
            {
                question: String,
                answer: String,
            }
        ],
        reviews: [reviewSchema],
        refundPolicy: {
            type: String,
            default: "30 days",
        },
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        shipping: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
        },
        price_unit: {
            type: String
        },
        discount:{
            type: Number,
            default: 0
        },
        cart_min: {
            type: Number,
            default: 0
        },
        cart_max: {
            type: Number,
            default: 0
        },
        images: [],

        // subProducts: [
        //     {
        //         images: [],
        //         description_images: [],
        //         color: {
        //             color: {
        //                 type: String,
        //             },
        //             image: {
        //                 type: String,
        //             },    
        //         },
        //         sizes: [
        //             {
        //                 size: String,
        //                 qty: Number,
        //                 price: Number,
        //             },
        //         ],
        //         discount: {
        //             type: Number,
        //             default: 0,
        //         },
        //         sold: {
        //             type: Number,
        //             default: 0,
        //         },
        //     },
        //],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;