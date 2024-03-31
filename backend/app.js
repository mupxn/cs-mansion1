var mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const app = express();
const port = 3001;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cs-mansion",
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database");
});

const corsOptions = {
    origin: ["http://localhost:4000", "http://localhost:4001"],
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
    session({
        secret: "your-secret-key-here",
        resave: false,
        saveUninitialized: true,
    })
);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} status ${res.statusCode} `);
    next();
});

app.listen(port, () => {
    try {
        console.log(`Listening at http://localhost:${port}`);
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/admin/authentication", async(req, res) => {
    const receivedData = req.body;
    try {
        const query = "SELECT * FROM admin WHERE Email = '" + receivedData.username + "' AND Password = '" + receivedData.password + "'";
        con.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send({
                    response: "Internal Server Error",
                    status: "Error",
                });
            } else {
                if (result.length > 0) {
                    req.session.admin = {
                        Username: result[0].Email
                    };
                    res.json({
                        response: result,
                        status: "success"
                    });
                } else {
                    res.status(401).json({
                        response: "Authentication failed",
                        status: "Error",
                    });
                }
            }
        });

    } catch (e) {

        res.status(500).send({
            response: "Internal Server Error",
            status: "Error",
        });
    }
});

app.get("/api/admin/accessSession", async(req, res) => {
    try {
        if (req.session.admin) {
            const body = {
                response: req.session.admin,
                isLogin: true,
                status: "success",
            };
            res.send(body);
        } else {
            res.status(401).send({
                response: "Authentication failed",
                status: "Error",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            response: "Internal Server Error",
            status: "Error",
        });
    }
});


app.get("/api/admin/removesessions", async(req, res) => {
    if (req.session.admin) {
        try {
            req.session.destroy();
            res.send({
                response: "Remove session success",
                status: "success"
            });
        } catch (error) {
            console.error("Error while destroying session:", error);
            res.status(500).send({
                response: "Internal Server Error",
                status: "Error"
            });
        }
    } else {
        res.send({
            response: "Authentication failed",
            status: "Error"
        });
    }
});

app.get("/api/admin/billstatus", async(req, res) => {
    try {
        con.query("SELECT * FROM billstatus", (err, result) => {
            if (err) {
                console.error("Error fetching bill status data:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.get("/api/admin/RoomID", async(req, res) => {
    try {
        con.query("SELECT `RoomID` FROM `room`", (err, result) => {
            if (err) {
                console.error("Error fetching RoomID data:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});


app.post('/api/admin/billdata', async(req, res) => {
    try {
        const receivedData = req.body;
        let dataSql =
            "SELECT bill.slip, bill.BillID, bill.RentingID, bill.BillWaterPrice, bill.BillElectricPrice," +
            " bill.BillTotalPrice, bill.BillStatusID,room.RoomPrice, billstatus.BillStatusName, bill.BillDate," +
            " renting.RoomID" +
            " FROM bill" +
            " INNER JOIN renting ON bill.RentingID = renting.RentingID" +
            " INNER JOIN billstatus ON billstatus.BillStatusID = bill.BillStatusID" +
            " INNER JOIN room ON room.RoomID = renting.RoomID" +
            " INNER JOIN user ON renting.UserID = user.UserID"
        let countSql =
            "SELECT COUNT(*) as count FROM bill" +
            " INNER JOIN renting ON bill.RentingID = renting.RentingID" +
            " INNER JOIN billstatus ON billstatus.BillStatusID = bill.BillStatusID" +
            " INNER JOIN room ON room.RoomID = renting.RoomID" +
            " INNER JOIN user ON renting.UserID = user.UserID"
        if (receivedData.statusId !== 'All' || receivedData.roomId !== 'All') {
            dataSql += ' WHERE';
            countSql += ' WHERE';
        }
        if (receivedData.statusId !== 'All') {
            dataSql += ` bill.BillStatusID = '${receivedData.statusId}'`;
            countSql += ` bill.BillStatusID = '${receivedData.statusId}'`;
            if (receivedData.roomId !== 'All') {
                dataSql += ' AND';
                countSql += ' AND';
            }
        }
        if (receivedData.roomId !== 'All') {
            dataSql += ` renting.RoomID = '${receivedData.roomId}'`;
            countSql += ` renting.RoomID = '${receivedData.roomId}'`;
        }
        dataSql += ' ORDER BY bill.BillDate DESC, renting.RoomID';
        dataSql += ` LIMIT ${receivedData.entries * (receivedData.page - 1)}, ${receivedData.entries}`;
        con.query(countSql, (countErr, countResult) => {
            if (countErr) {
                console.error('Error while counting records:', countErr);
                res.status(500).send('Internal Server Error');
            } else {
                const totalRecord = countResult[0].count;
                con.query(dataSql, (dataErr, dataResult) => {
                    if (dataErr) {
                        console.error('Error while fetching data:', dataErr);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send({
                            bill: dataResult,
                            allRecord: totalRecord
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/admin/billdata/expenses", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "SELECT * FROM expenses WHERE BillID = " + receivedData.billId,
            (err, result) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send(result);
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/admin/billdata/insert", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "INSERT INTO `bill`(`RentingID`, `BillWaterPrice`, `BillElectricPrice`, `BillTotalPrice`, `BillDate`) VALUES ('" + receivedData.RentingID + "','" + receivedData.BillWaterPrice + "','" + receivedData.BillElectricPrice + "','" + receivedData.TotalPrice + "','" + receivedData.BillDate + "')",
            (err, result) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send({
                        status: 'success',
                        insertId: result.insertId
                    })
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/admin/billdata/expend/insert", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "INSERT INTO `expenses`( `BillID`, `ExpenTitle`, `ExpenPrice`) VALUES ('" + receivedData.BillID + "','" + receivedData.ExpenTitle + "','" + receivedData.ExpenPrice + "')",
            (err, result) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send({
                        status: 'success',
                        insertId: result.insertId
                    })
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/admin/billdata/update", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "SELECT * FROM bill INNER JOIN renting ON bill.RentingID = renting.RentingID INNER JOIN room ON room.RoomID = renting.RoomID WHERE BillID = '" + receivedData.billId + "'",
            (err, result) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    let newTotalPrice = parseFloat(result[0].RoomPrice) + parseFloat(receivedData.BillWaterPrice) + parseFloat(receivedData.BillElectricPrice);
                    receivedData.ExpensesPrice.forEach((p, index) => {
                        newTotalPrice += parseFloat(p)
                        con.query(
                            "UPDATE `expenses` SET `ExpenTitle`='" + receivedData.ExpensesTitle[index] + "',`ExpenPrice`='" + receivedData.ExpensesPrice[index] + "' WHERE ExpenID = '" + receivedData.ExpensesID[index] + "'",
                            (err, result) => {
                                if (err) {
                                    console.error("Error fetching expenses:", err);
                                    res.status(500).send("Internal Server Error");
                                }
                            }
                        );
                    });
                    con.query(
                        "UPDATE `bill` SET `BillWaterPrice`='" + receivedData.BillWaterPrice + "',`BillElectricPrice`='" + receivedData.BillElectricPrice + "',`BillTotalPrice`='" + newTotalPrice + "' WHERE BillID = '" + receivedData.billId + "'",
                        (err, result) => {
                            if (err) {
                                console.error("Error fetching expenses:", err);
                                res.status(500).send("Internal Server Error");
                            } else {
                                res.send({
                                    status: 'success',
                                    newTotalPrice: newTotalPrice
                                });
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/admin/billdata/updateStatus", async(req, res) => {
    try {
        const receivedData = req.body;
        const updateQuery = "UPDATE `bill` SET `BillStatusID`='" + receivedData.statusID + "' WHERE BillID = '" + receivedData.billID + "'";

        con.query(updateQuery, (err, result) => {
            if (err) {
                console.error("Error updating bill status:", err);
                res.status(500).send({
                    status: 'error'
                });
            } else {
                res.send({
                    status: 'success'
                });
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/admin/billdata/delete", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "DELETE FROM bill WHERE BillID = " + receivedData.billId,
            (err, result) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send({
                        status: 'success'
                    });
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.get("/api/admin/user", async(req, res) => {
    try {
        con.query("SELECT * FROM user", (err, result) => {
            if (err) {
                console.error("Error fetching user data:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});


app.post("/api/admin/user/update", async(req, res) => {
    try {
        const receivedData = req.body;
        const updateQuery = "UPDATE `user` SET `UserName`='" + receivedData.UserName + "',`UserPhone`='" + receivedData.UserPhone + "',`UserAddress`='" + receivedData.UserAddress + "' WHERE UserID = '" + receivedData.UserID + "'";
        con.query(updateQuery, (err, result) => {
            if (err) {
                console.error("Error updating bill status:", err);
                res.status(500).send({
                    status: 'error'
                });
            } else {
                res.send({
                    status: 'success'
                });
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/admin/room", async(req, res) => {
    try {
        const receivedData = req.body;
        let dataSql = `SELECT * FROM room INNER JOIN roomstatus ON room.RoomStatusID = roomstatus.RoomStatusID INNER JOIN roomtype ON room.RoomTypeID = roomtype.RoomTypeID`;
        let countSql = `SELECT COUNT(*) as count FROM room INNER JOIN roomstatus ON room.RoomStatusID = roomstatus.RoomStatusID INNER JOIN roomtype ON room.RoomTypeID = roomtype.RoomTypeID`;
        if (receivedData.statusId !== 'All' || receivedData.roomId !== 'All') {
            dataSql += ' WHERE';
            countSql += ' WHERE';
        }
        if (receivedData.statusId !== 'All') {
            dataSql += ` room.RoomStatusID = '${receivedData.statusId}'`;
            countSql += ` room.RoomStatusID = '${receivedData.statusId}'`;
            if (receivedData.roomId !== 'All') {
                dataSql += ' AND';
                countSql += ' AND';
            }
        }
        if (receivedData.roomId !== 'All') {
            dataSql += ` room.RoomID = '${receivedData.roomId}'`;
            countSql += ` room.RoomID = '${receivedData.roomId}'`;
        }
        dataSql += ' ORDER BY RoomID ';
        dataSql += ` LIMIT ${receivedData.entries * (receivedData.page - 1)}, ${receivedData.entries}`;
        con.query(countSql, (countErr, countResult) => {
            if (countErr) {
                console.error('Error while counting records:', countErr);
                res.status(500).send('Internal Server Error');
            } else {
                const totalRecord = countResult[0].count;
                con.query(dataSql, (dataErr, dataResult) => {
                    if (dataErr) {
                        console.error('Error while fetching data:', dataErr);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send({
                            bill: dataResult,
                            allRecord: totalRecord
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});
app.post("/api/admin/room/update", async(req, res) => {
    try {
        const receivedData = req.body;
        const updateQuery = "UPDATE `room` SET `RoomPrice`='" + receivedData.RoomPrice + "',`RoomDetail`='" + receivedData.RoomDetail + "',`RoomTypeID`='" + receivedData.RoomTypeID + "' WHERE RoomID = '" + receivedData.RoomID + "'";
        con.query(updateQuery, (err, result) => {
            if (err) {
                console.error("Error updating bill status:", err);
                res.status(500).send({
                    status: 'error'
                });
            } else {
                res.send({
                    status: 'success'
                });
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});
app.post("/api/admin/room/updateStatus", async(req, res) => {
    try {
        const receivedData = req.body;

        const updateQuery = "UPDATE `room` SET `BillStatusID`='" + receivedData.statusID + "' WHERE BillID = '" + receivedData.billID + "'";

        con.query(updateQuery, (err, result) => {
            if (err) {
                console.error("Error updating bill status:", err);
                res.status(500).send({
                    status: 'error'
                });
            } else {
                res.send({
                    status: 'success'
                });
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});
app.get("/api/admin/roomtype", async(req, res) => {
    try {
        con.query("SELECT * FROM roomtype ", (err, result) => {
            if (err) {
                console.error("Error fetching room data:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});
app.get("/api/admin/roomstatus", async(req, res) => {
    try {
        con.query("SELECT * FROM roomstatus ", (err, result) => {
            if (err) {
                console.error("Error fetching room data:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

// new backend
app.post("/api/admin/user/insert", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "INSERT INTO user(UserID,UserName,UserPhone,UserAddress) VALUES ('" + receivedData.UserID + "','" + receivedData.UserName + "','" + receivedData.UserPhone + "','" + receivedData.UserAddress + "')",
            (err, result) => {
                if (err) {
                    console.error("Error fetching renting data:", err);

                } else {
                    res.send({ status: 'success' });
                }
            }
        );
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.get("/api/admin/renting", async(req, res) => {
    try {
        con.query(
            "SELECT * FROM renting INNER JOIN room ON room.RoomID = renting.RoomID INNER JOIN user ON user.UserID = renting.UserID ",
            (err, result) => {
                if (err) {
                    console.error("Error fetching renting data:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send(result);
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});
app.post("/api/admin/renting/out", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "UPDATE `renting` SET `RentingEnd`='" + receivedData.RentingEnd + "' WHERE `RentingID` = '" + receivedData.RentingID + "'",
            (err1, result1) => {
                if (err1) {
                    console.error("Error fetching renting data:", err1);
                    res.status(500).send("Internal Server Error");
                } else {
                    con.query(
                        "UPDATE `room` SET `RoomStatusID`='1' WHERE RoomID='" + receivedData.RoomID + "'",
                        (err2, result2) => {
                            if (err2) {
                                console.error("Error fetching renting data:", err2);
                                res.status(500).send("Internal Server Error");
                            } else {
                                res.send({
                                    response: result2,
                                    status: "success"
                                });
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});
// new backend
app.post("/api/admin/renting/in", async(req, res) => {
    try {
        const receivedData = req.body;
        const D = new Date()
        con.query(
            "INSERT INTO `renting`(`RoomID`, `UserID`, `RentingStart`) VALUES ('" + receivedData.RoomID + "','" + receivedData.UserID + "','" + (D.getFullYear().toString() + "-" + (D.getMonth() + 1)).toString().padStart(2, "0") + "-" + D.getDate().toString().padStart(2, "0") + "')",
            (err, result) => {
                if (err) {
                    console.error("Error fetching renting data:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    con.query(
                        "UPDATE `room` SET `RoomStatusID`='2' WHERE RoomID='" + receivedData.RoomID + "'",
                        (err, result) => {
                            if (err) {
                                console.error("Error fetching renting data:", err);
                                res.status(500).send("Internal Server Error");
                            } else {
                                res.send({
                                    response: result,
                                    status: "success"
                                });
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.get("/api/admin/renting/CreateBill", async(req, res) => {
    try {
        const D = new Date();
        con.query(
            `SELECT * FROM renting INNER JOIN room ON room.RoomID = renting.RoomID INNER JOIN user ON user.UserID = renting.UserID WHERE (SELECT COUNT(*) FROM bill WHERE BillDate LIKE "${D.getFullYear()}-${(D.getMonth() + 1)}-%" AND bill.RentingID=renting.RentingID) = 0 AND RentingEnd IS NULL ORDER BY renting.RoomID;`,
            (err, result) => {
                if (err) {
                    console.error("Error fetching data for CreateBill:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send(result);
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.get("/api/admin/Detail", async(req, res) => {
    try {
        con.query(
            "SELECT * FROM `mansiondetail` WHERE 1",
            (err, result) => {
                if (err) {
                    console.error("Error fetching mansion details:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send(result);
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.get("/api/admin/graph", (req, res) => {
        try {
            con.query(
                "SELECT SUM(`BillTotalPrice`)AS Total,`BillDate`  FROM bill GROUP BY `BillDate` ORDER BY `BillDate` DESC LIMIT 6",
                (err, result) => {
                    if (err) {
                        console.error("Error fetching mansion details:", err);
                        res.status(500).send("Internal Server Error");
                    } else {
                        res.send(result);
                    }
                }
            );
        } catch (error) {
            res.status(500)
                .send({
                    response: "Internal Server Error",
                    status: "Error"
                });
        }
    })
    //new backend
app.post("/api/admin/room/insert", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(`INSERT INTO room (RoomID,RoomPrice,RoomDetail,RoomSize,RoomTypeID, RoomStatusID)  VALUES ('${receivedData.RoomID}','${receivedData.RoomPrice}','${receivedData.RoomDetail}','${receivedData.RoomSize}','${receivedData.RoomTypeID}','1')`, (err, result) => {
            if (err) {
                console.error("Error Insert Room data:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send({ response: result, status: "success" });
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});



// app.get("/api/admin/add-billdata", async (req, res) => {
//   const m = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
//   const y = [2019, 2020, 2021, 2022, 2023]
//   const rid = [0, 1, 2, 3]
//   y.forEach((y) => {
//     m.forEach(async (m) => {
//       console.log("INSERT INTO `bill`(`RentingID`, `BillWaterPrice`, `BillElectricPrice`, `BillTotalPrice`, `BillStatusID`, `BillDate`) VALUES (1,10,100,5300,1,'" + y + "-" + m + "-25')")
//       await con.query(
//         "INSERT INTO `bill`(`RentingID`, `BillWaterPrice`, `BillElectricPrice`, `BillTotalPrice`, `BillStatusID`, `BillDate`) VALUES (1,10,100,5300,1,'" + y + "-" + m + "-25')",
//         async (err, result) => {
//           if (err) throw err;
//           // await res.send(result);
//         })
//     })
//   })
// })
// const m = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// const y = [2013,2014,2015, 2016, 2027]
// y.forEach((y) => {
//   m.forEach(async (m) => {
//     console.log("INSERT INTO `bill`(`RentingID`, `BillWaterPrice`, `BillElectricPrice`, `BillTotalPrice`, `BillStatusID`, `BillDate`) VALUES (1,10,100,5300,1,'" + y + "-" + m + "-25')")
//     await con.query(
//       "INSERT INTO `bill`(`RentingID`, `BillWaterPrice`, `BillElectricPrice`, `BillTotalPrice`, `BillStatusID`, `BillDate`) VALUES (1,10,100,5300,1,'" + y + "-" + m + "-25')",
//       async (err, result) => {
//         if (err) throw err;
//         // await res.send(result);
//       })
//   })
// })
// const addbilldata = async (str) => {
//   await con.query(
//     str,
//     async (err, result) => {
//       if (err) throw err;
//       await console.log(result)
//       // await res.send(result);
//     })
// }
// let i = 1;
// const m = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
// const y = [2019, 2020, 2021, 2022, 2023]
// const rid = [0, 1, 2, 3]
// y.forEach(async (y) => {
//   m.forEach(async (m) => {
//     rid.forEach(async (r) => {
//       addbilldata("INSERT INTO `bill`(`BillID`,`RentingID`, `BillWaterPrice`, `BillElectricPrice`, `BillTotalPrice`, `BillStatusID`, `BillDate`, `slip`) VALUES ('" + i + "','" + r + "',10,100,5300,1,'" + y + "-" + m + "-25','https://s359.kapook.com//pagebuilder/ba154685-db18-4ac7-b318-a4a2b15b9d4c.jpg')")
//       console.log("INSERT INTO `bill`(`BillID`,`RentingID`, `BillWaterPrice`, `BillElectricPrice`, `BillTotalPrice`, `BillStatusID`, `BillDate`, `slip`) VALUES ('" + i + "','" + r + "',10,100,5300,1,'" + y + "-" + m + "-25','https://s359.kapook.com//pagebuilder/ba154685-db18-4ac7-b318-a4a2b15b9d4c.jpg')")
//       i++;
//     })

//   })
// })
// const addbilldata = async (str) => {
//   await con.query(
//     str,
//     async (err, result) => {
//       if (err) throw err;
//       await console.log(result)
//       // await res.send(result);
//     })
// }
// const getRandomInt=(max)=> {
//   return Math.floor(Math.random() * max);
// }
// const rid = [1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115,
//   1202, 1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210, 1211, 1212, 1213, 1214, 1215,
//   1301, 1302, 1303, 1304, 1305, 1306, 1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315,
//   1401, 1402, 1403, 1404, 1405, 1406, 1407, 1408, 1409, 1410, 1411, 1412, 1413, 1414, 1415,
//   1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1515,
// ]
// const d = [
//   ['3700','27 ตร.ม. แอร์','27','2','1'],
//   ['4200','30 ตร.ม. แอร์','30','2','1'],
//   ['3200','27 ตร.ม. พัดลม','27','1','1'],
//   ['3500','30 ตร.ม. พัดลม','30','1','1'],
// ]
// rid .forEach(async (r) => {
//   const rd = d[getRandomInt(4)];
//   console.log(r)
//   addbilldata("INSERT INTO `room`(`RoomID`, `RoomPrice`, `RoomDetail`, `RoomSize`, `RoomTypeID`, `RoomStatusID`) VALUES ('" + r + "','"+rd[0]+"','"+rd[1]+"','"+rd[3]+"','"+rd[3]+"','"+rd[4]+"')")

// })




//-------------------------------------------------user------------------------------------------
app.post("/api/user/authentication", async(req, res) => {

    const receivedData = req.body;
    try {
        const query = "SELECT * FROM renting WHERE RoomID = '" + receivedData.RoomID + "' AND UserID = '" + receivedData.UserID + "' AND RentingEnd IS NULL";
        con.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send({
                    response: "Internal Server Error",
                    status: "Error",
                });
            } else {
                if (result.length > 0) {
                    req.session.user = {
                        Username: result[0].RoomID,
                        RentingID: result[0].RentingID,
                        isLogin: true
                    };
                    res.json({
                        response: {
                            Username: result[0].RoomID,
                            RentingID: result[0].RentingID,
                            isLogin: true
                        },
                        status: "success"
                    });
                } else {
                    res.status(401).json({
                        response: "Authentication failed",
                        status: "Error",
                    });
                }
            }
        });

    } catch (e) {

        res.status(500).send({
            response: "Internal Server Error",
            status: "Error",
        });
    }
});

app.get("/api/user/accessSession", async(req, res) => {
    try {
        if (req.session.user) {
            const body = {
                response: req.session.user,
                isLogin: true,
                status: "success",
            }
            res.send(body);
        } else {
            res.status(401).send({
                response: "Authentication failed",
                status: "Error",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            response: "Internal Server Error",
            status: "Error",
        });
    }
});


app.get("/api/user/removesessions", async(req, res) => {

    if (req.session.user) {
        try {
            req.session.destroy();
            res.send({
                response: "Remove session success",
                status: "success"
            });
        } catch (error) {
            console.error("Error while destroying session:", error);
            res.status(500).send({
                response: "Internal Server Error",
                status: "Error"
            });
        }
    } else {
        res.send({
            response: "Authentication failed",
            status: "Error"
        });
    }
});

app.get("/api/user/billstatus", async(req, res) => {
    try {
        con.query("SELECT * FROM billstatus", (err, result) => {
            if (err) {
                console.error("Error fetching bill status data:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.get("/api/user/RoomID", async(req, res) => {
    try {
        con.query("SELECT `RoomID` FROM `room`", (err, result) => {
            if (err) {
                console.error("Error fetching RoomID data:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post('/api/user/billdata', async(req, res) => {
    try {
        const receivedData = req.body;
        let dataSql =
            "SELECT bill.slip, bill.BillID, bill.RentingID, bill.BillWaterPrice, bill.BillElectricPrice," +
            " bill.BillTotalPrice, bill.BillStatusID,room.RoomPrice, billstatus.BillStatusName, bill.BillDate," +
            " renting.RoomID" +
            " FROM bill" +
            " INNER JOIN renting ON bill.RentingID = renting.RentingID" +
            " INNER JOIN billstatus ON billstatus.BillStatusID = bill.BillStatusID" +
            " INNER JOIN room ON room.RoomID = renting.RoomID" +
            " INNER JOIN user ON renting.UserID = user.UserID"
        let countSql =
            "SELECT COUNT(*) as count FROM bill" +
            " INNER JOIN renting ON bill.RentingID = renting.RentingID" +
            " INNER JOIN billstatus ON billstatus.BillStatusID = bill.BillStatusID" +
            " INNER JOIN room ON room.RoomID = renting.RoomID" +
            " INNER JOIN user ON renting.UserID = user.UserID"
        if (receivedData.statusId !== 'All' || receivedData.roomId !== 'All') {
            dataSql += ' WHERE';
            countSql += ' WHERE';
        }
        if (receivedData.statusId !== 'All') {
            dataSql += ` bill.BillStatusID = '${receivedData.statusId}'`;
            countSql += ` bill.BillStatusID = '${receivedData.statusId}'`;
            if (receivedData.roomId !== 'All') {
                dataSql += ' AND';
                countSql += ' AND';
            }
        }
        if (receivedData.roomId !== 'All') {
            dataSql += ` renting.RoomID = '${receivedData.roomId}'`;
            countSql += ` renting.RoomID = '${receivedData.roomId}'`;
        }
        dataSql += ' ORDER BY bill.BillDate DESC, renting.RoomID';
        dataSql += ` LIMIT ${receivedData.entries * (receivedData.page - 1)}, ${receivedData.entries}`;
        con.query(countSql, (countErr, countResult) => {
            if (countErr) {
                console.error('Error while counting records:', countErr);
                res.status(500).send('Internal Server Error');
            } else {
                const totalRecord = countResult[0].count;
                con.query(dataSql, (dataErr, dataResult) => {
                    if (dataErr) {
                        console.error('Error while fetching data:', dataErr);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send({
                            bill: dataResult,
                            allRecord: totalRecord
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/user/billdata/expenses", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "SELECT * FROM expenses WHERE BillID = " + receivedData.billId,
            (err, result) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send(result);
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/user/slip", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            "UPDATE `bill` SET `slip`='" + receivedData.slip + "',`BillStatusID`='3' WHERE `BillID` = " + receivedData.billId,
            (err, result) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send(result);
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.post("/api/user/info", async(req, res) => {
    try {
        const receivedData = req.body;
        con.query(
            `SELECT * FROM renting INNER JOIN room ON room.RoomID = renting.RoomID INNER JOIN roomtype ON roomtype.RoomTypeID = room.RoomTypeID INNER JOIN user ON renting.UserID = user.UserID WHERE renting.RentingID = ${receivedData.RentingID}`,
            (err, result) => {
                if (err) {
                    console.error("Error fetching expenses:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    res.send(result);
                }
            }
        );
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
});

app.get("/api/user/graph", (req, res) => {
    try {
        if (req.session.user.RentingID) {
            con.query(
                `SELECT SUM(BillTotalPrice) AS Total, BillDate FROM bill WHERE RentingID = ${req.session.user.RentingID} GROUP BY BillDate ORDER BY BillDate DESC LIMIT 6;`,
                (err, result) => {
                    if (err) {
                        console.error("Error fetching mansion details:", err);
                        res.status(500).send("Internal Server Error");
                    } else {
                        res.send(result);
                    }
                }
            );
        } else {
            res.send({
                Total: '',
                BillDate: ''
            });
        }
    } catch (error) {
        res.status(500)
            .send({
                response: "Internal Server Error",
                status: "Error"
            });
    }
})