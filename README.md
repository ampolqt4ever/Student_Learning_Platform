
  # Student Learning Platform

  This is a code bundle for Student Learning Platform. The original project is available at https://www.figma.com/design/Jzr2C5THARq6tMjxt8HbKI/Student-Learning-Platform.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Real gesture detection (SignMath model)

  `GestureDetection.tsx` (lesson practice) and `GestureRecognitionScreen.tsx`
  (gesture recognition demo) stream webcam frames to the SignMath backend for
  real predictions from `signmath_model.h5`, instead of the random mock that
  used to be there.

  1. Set up and run the backend — see `signmath-backend/README.md`.
  2. Copy `.env.example` to `.env.local` if the backend isn't on the default
     `localhost:8000`.
  3. Run `npm run dev` as usual. If the backend isn't reachable, both screens
     fall back to a clearly-labeled demo mode rather than failing silently.

  The model only recognizes 11 classes (`one`–`ten`, `plus`). Lessons that use
  unsupported signs (`0`, `-`, `=`, `×`, `÷`, `10`+ multi-digit numbers beyond
  ten) automatically use demo mode for those specific signs.
  