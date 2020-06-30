# Web-Programming-ApiVersioning
Assignment 11 of Bethel University Fall 2019's Web Programming course

A follow-up to Assignment 9 (Cloud Storage).

Changes made to assignment 9:
- HTML/Javascript
  - HTML: A copy of the HTML page was made so now there are two, known as 1.0 and 1.1.
  The new page contains 3 new things:
    - A field called "description."
    - Some indication of which version of the page is currently being used.
    - A link to both pages, taking the user to the other page.
  - Javascript: Updated javascript to send the api-version query parameter with all requests.
  The api-version that is sent matches the version displayed on the HTML page. If on version 1.1,
  the descript field will send in the JSON body to the server when posting new images. The
  description field must be at least 5 characters long.
- Server
  - Controller: Added 2nd ImagesController, tagged with api versions of 1.0 and 1.1.
  - Entities: Added 2nd ImageEntity, adding a Description string that is required
  and has a minimum length of 5.
  - ImageModel: Modified to store the description field.
