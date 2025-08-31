import { atom, selector } from "recoil";

export const userRoleAtom = atom({
  key: "userRole",
  default: "",
});

export const userIdAtom = atom({
  key: "userId",
  default: "",
});

export const userAvatarAtom = atom({
  key: "userAvatarAtom",
  default: selector({
    key: "userAvatarDefault",
    get: ({ get }) => {
      const userId = get(userIdAtom);
      // Generate realistic human avatar using DiceBear
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&mouth=smile&style=circle`;
      return avatarUrl;
    },
  }),
});

export const userAvatarSelector = selector({
  key: "userAvatarSelector",
  get: ({ get }) => {
    return get(userAvatarAtom);
  },
  set: ({ set, get }, newValue) => {
    if (!newValue) {
      const userId = get(userIdAtom);
      // Generate realistic human avatar using DiceBear
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&mouth=smile&style=circle`;
      set(userAvatarAtom, avatarUrl);
    } else {
      set(userAvatarAtom, newValue);
    }
  },
});

export const isLoggedInAtom = atom({
  key: "isLoggedIn",
  default: !!localStorage.getItem("token"),
});



export const likedReviewsAtom = atom({
  key: "likedReviews",
  default: [],
});

export const likedCommentsAtom = atom({
  key: "likedComments",
  default: [],
});

export const isUserLoadingAtom = atom({
  key: "isUserLoading",
  default: false,
});

export const usersFavouritestoresAtom = atom({
  key: "usersFavouritestores",
  default: [],
});
