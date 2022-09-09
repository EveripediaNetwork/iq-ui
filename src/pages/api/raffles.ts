import { RAFFLE_DATA } from "@/data/RaffleData";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res:NextApiResponse ) {
    res.status(200).json(RAFFLE_DATA)
}