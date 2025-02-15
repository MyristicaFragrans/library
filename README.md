# Library

A simple webapp built on Pocketbase to offer a self-hostable library that
supports checking out books with a limited number of copies and reading them.

Please see the section "Piracy" on the legality of using this software.

## Usage

There is currently no dedicated UI to add books or create accounts and must be
done inside Pocketbase. You can create new users in the `users` collection.

### Add a book

First, create an author entry (if not already there) in the `authors`
collection.

Then, create a book entry in `books`.

It will appear in your webapp upon refreshing the page.

## Setup

Run the pocketbase server with `./pocketbase serve`. Open up the admin panel,
create an account, and import the schema `pb_schema.json`.

Build the webapp by running the following:

```sh
cd webapp
yarn # install dependencies
yarn build # build webapp
```

Then visit `127.0.0.1:8090` (or whatever IP you have configured for Pocketbase)

## Licensing

The code for this app is licensed under the MPL-2.0.

Included is the code for projects "pdfjs", licensed under Apache-2.0, and
Vivliostyle Viewer for rendering EPUB, licensed under AGLP-3.0.

The server and database is "Pocketbase" which is licensed under the MIT license.

Because of the AGPL license, if you do not remove Vivliostyle, you may be
required to share Library and Vivliostyle under AGPL. Please consult a lawyer
about your options if this does not make sense for your use cases.

## Piracy

This software is not meant to promote or encourage piracy of books, which
authors spend a lot of time writing and putting together to effectively
communicate ideas or stories. I do not condone misuse of Fair Use to justify
theft.

The original intention of this application was to implement "controlled digital
lending" like Internet Archive. However, "Hachette v. Internet Archive" ruled
against this practice of only lending out as many legal copies were purchased.
Please double check if any books you are sharing would violate copyright law,
even through controlled digital lending, as well as local laws.

Please keep these notes in mind when uploading books that may put you at risk of
legal action. 

### DRM Mechanism

This library wraps an extremely thin DRM on books, making it not
straight-forward to download lent books. It is by no means perfect and is easily
defeated.
