// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/',
  rootSiteUrl: 'https://localhost:4200',
  cloudinary: {
    cloud_name: 'hunk4smqo',
    uploadPreset: 'wish_images',
    apiKey: "645975382923815",
    defaultImage: {
      publicId: "wish_images/default",
      version: "1556702046"
    },
    temporaryImagePostfix: '_temp',
    uploadWidget : {
      text: {
        "nl": {
          "queue": {
            "title": "Overzicht",
            "title_uploading_with_counter": "{{num}} bestanden aan het opladen",
            "title_uploading": "Bestanden aan het laden",
            "mini_title": "Opgeladen",
            "mini_title_uploading": "Aan het opladen",
            "show_completed": "Toon opgeladen bestanden",
            "retry_failed": "Nieuwe poging is gefaald",
            "abort_all": "Alles afbreken",
            "upload_more": "Meer opladen",
            "more": "Meer",
            "mini_upload_count": "{{num}} Opgelade,",
            "mini_failed": "{{num}} Gefaald",
            "statuses": {
              "uploading": "Aan het opladen...",
              "error": "Fout",
              "uploaded": "Klaar",
              "aborted": "Afgebroken"
            }
          },
          "or": "Of",
          "advanced": "Geavanceerd",
          "close": "Sluiten",
          "no_results": "Geen resultaten",
          "search_placeholder": "Zoek bestanden",
          "menu": {
            "files": "Opladen / camera",
            "web": "Internetlink",
            "gsearch": "Zoeken op Google",
          },
          "selection_counter": {
            "selected": "Geselecteerd"
          },
          "actions": {
            "upload": "Opladen",
            "clear_all": "Wis de selectie",
            "log_out": "Uitloggen"
          },
          "notifications": {
            "general_error": "Er is iets fout gegaan. Probeer opnieuw aub.",
            "general_prompt": "Ben je zeker?",
            "limit_reached": "Er kunnen geen bestanden meer geselecteerd worden",
            "invalid_add_url": "De toegevoegde link is niet correct",
            "invalid_public_id": "De publieke ID mag geen van volgende tekens bevatten: \\,?,&,#,%,<,>",
            "no_new_files": "De geselecteerde bestanden zijn al opgeladen"
          },
          "landscape_overlay": {
            "title": "Landscape mode is niet ondersteund",
            "description": "Draai je toestel terug naar portrait mode om verder te gaan."
          },
          "image_search": {
            "main_title": "Zoek afbeelding op Google",
            "inputPlaceholder": "Geef een zoekterm in",
            "customPlaceholder": "Zoek op {{site}}",
            "filters_title": "site",
            "rights": "Gebruiksrechten",
            "rights_options": {
              "not_filtered": "Niet gefilterd per licentie",
              "free": "Vrij te gebruiken of delen",
              "free_com": "Vrij te gebruiken of delen, zelfs commercieel",
              "free_mod": "Vrij te gebruiken, delen of wijzigen",
              "free_mod_com": "Vrij te gebruiken, delen of wijzigen, zelfs commercieel"
            },
            "search_error": "Zoeken is mislukt, probeer opnieuw."
          },
          "local": {
            "main_title": "Laad bestanden op"
          }
        }
      }
    }
  },
  googleApi: {
    googleApiKey: "AIzaSyBAIBGqd2gf9KE4zWOwsz5v_znLzyuAMV8"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
