import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    // Checks if there are any restaurants in that city, if not search will end early
    query["city"] = new RegExp(city, "i"); // Gets the restaurants that have matching "city" field value with the variable city
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      res.status(404).json({
        data:[],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        }
      });
      return;
    }

    if (selectedCuisines) {
      // URL = selectedCuisines=italian,chinese,american
      // [italian,chinese,american]
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      //find all restaurants where cuisines matches ALL (-> $all) the ones selected in the query
      query["cuisines"] = { $all: cuisinesArray };
    }

    // Searches for restaurants which name or cuisines tags match the search query
    // inserted by the user
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [ 
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } }, // $in : just one matching tag is enough, no need for ALL
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize; // based on which N page the user is in, will skip the previus N*10 results

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 }) // sortOption defaults to "lastUpdated"
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize), // calculates how many pages are neccessary
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  searchRestaurant,
};
