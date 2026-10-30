/* ============================================================
   CONTACT FORM — message sorasori apnar email e ashe
   ------------------------------------------------------------
   Visitor site er bhitorei message likhe "Send" chape.
   Kono mail app / message app KHOLE NA.

   Message jay ei order e (ekta fail korle porer ta):
     1. Netlify Forms   (main — apnar site Netlify te)
     2. Web3Forms       (shudhu jodi niche key dewa thake)
     3. FormSubmit      (backup)
   Shob fail korle visitor ke bola hoy "abar try korun" —
   kono app khola hoy na.

   NETLIFY TE EKBAR JA KORTE HOBE (GUIDE.md -> "ভাগ ১"):
     a) Forms -> "Enable form detection"
     b) dist folder abar Deploys page e upload
     c) Forms -> Submission notifications -> Add notification
        -> Email notification -> nadim13158@gmail.com -> Save
   ============================================================ */

/** Jekhane message ashbe */
export const CONTACT_EMAIL = "nadim13158@gmail.com";

/** Netlify form er naam — index.html er lukano form er naam er sathe mile */
export const NETLIFY_FORM_NAME = "contact";

/* ------------------------------------------------------------
   OPTIONAL backup — Web3Forms key (dorkar nai, Netlify e cholbe)
   https://web3forms.com e email diye key nile ekhane boshan.
   ------------------------------------------------------------ */
export const WEB3FORMS_ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY ?? "").trim();
// ↑ VERCEL E: Vercel -> Settings -> Environment Variables -> VITE_WEB3FORMS_KEY
//   (key nite: https://web3forms.com -> email likhe "Create Access Key")

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

/** Ekta message e max koto character */
export const MAX_MESSAGE_LENGTH = 1500;
