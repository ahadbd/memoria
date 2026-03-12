import { FSRS, Rating } from "ts-fsrs";

export const fsrs = new FSRS({
  request_retention: 0.9,
  maximum_interval: 36500,
  w: [
    0.4025, 1.4614, 3.3254, 15.4208, 5.8315, 0.938, 1.3209, 0.0, 1.4879, 0.134,
    1.0195, 1.9795, 0.0069, 0.3314, 1.1455, 0.2317, 2.7351,
  ],
  enable_fuzz: true,
});

export const ratings = [
  { label: "Again", value: Rating.Again, color: "text-rose-400" },
  { label: "Hard", value: Rating.Hard, color: "text-amber-400" },
  { label: "Good", value: Rating.Good, color: "text-emerald-400" },
  { label: "Easy", value: Rating.Easy, color: "text-indigo-400" },
];
