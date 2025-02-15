/// <reference path="../pb_data/types.d.ts" />

//routerAdd("GET", "/pdfjs-legacy/*", $apis.staticDirectoryHandler("pb_public/pdfjs-legacy", false))
routerAdd("GET", "/*", $apis.staticDirectoryHandler("pb_public/", true))

onAfterBootstrap((e) => {
  console.log("App initialized!");
});

routerAdd("POST", "/api/library/loans/checkout", (c) => {
  const auth = c.get("authRecord");
  if (!auth)
    throw new UnauthorizedError("not_logged_in", "Not logged in"); // Unauthorized
  const data = $apis.requestInfo(c).data;

  const result = new DynamicModel({
    id: "",
    copies: 0,
    in_use: 0,
  });

  // Check that the book requested actually exists
  try {
    $app
      .dao()
      .db()
      .newQuery(
        "SELECT book_data.id, book_data.copies, book_data.in_use FROM book_data WHERE book_data.id = {:id}"
      )
      .bind({
        id: data.id,
      })
      .one(result);
  } catch (e) {
    throw new ApiError(404, "Unknown book", {
      id: new ValidationError("invalid_id", "Invalid or unknown book id"),
    });
  }

  // Check that there are copies available
  if (result.copies <= result.in_use) {
    throw new ForbiddenError("No more copies"); // No copies available
  }
  // At this point I am reasonably sure that the user may check out the book.
  const loans = $app.dao().findCollectionByNameOrId("loans");
  const newLoan = new Record(loans, {
    user: auth.id,
    book: result.id,
    expires: DateTime().time().addDate(0,0,7)
  });
  const res = $app.dao().saveRecord(newLoan)
  return c.string(200, "done");
});

cronAdd("CleanupLoans", "*/2 * * * *", cleanupLoans);
//routerAdd("GET", "api/library/loans/cleanup", cleanupLoans)

function cleanupLoans() {
  $app.dao().runInTransaction((txDao)=>{
    const expiredLoans = arrayOf(new DynamicModel({
      "id": "",
      "book_name": "",
      "bookid": "",
      "expires": "",
      "userid": "",
      "username": "",
      "email": ""
    }));
    txDao.adminQuery().select("loans.id", "books.book_name", "books.id AS bookid", "loans.expires", "users.id AS userid", "users.username", "users.email")
      .from("loans")
      .where($dbx.exp("loans.expires < {:date}", {"date": new Date().toISOString()}))
      .leftJoin("users", $dbx.exp("users.id = loans.user"))
      .leftJoin("books", $dbx.exp("books.id = loans.book"))
      .all(expiredLoans)
    // process whatever here. emails?
    for (let loan of expiredLoans) {
      console.log("Deleting " + loan.id);
      txDao.db().delete("loans", $dbx.exp("id = {:id}", {id: loan.id})).execute();
    }
  })
}