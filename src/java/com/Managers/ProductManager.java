/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Managers;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.sql.Time;
import java.text.ParseException;
import java.util.*;
import wmengine.Tables.Tables;
import wmengine.Managers.*;

/**
 *
 * @author Saint
 */
public class ProductManager {

    //START TOLU REGION
    public static String UpdateUserCartFromSession(int UserID, String sessionCart) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String result = "";
        int cartid = 0;
        int sessionCartID = Integer.parseInt(sessionCart);
        cartid = DBManager.GetInt(Tables.Cart.ID, Tables.Cart.Table, "where " + Tables.Cart.UserID + " = " + UserID);
        if (cartid == 0) {
            result = DBManager.UpdateIntData(Tables.Cart.UserID, UserID, Tables.Cart.Table, "where " + Tables.Cart.UserID + " = " + sessionCartID);
        } else {
            String sessionproductdetails = GetCartProductDetail(sessionCartID);
            String details[] = sessionproductdetails.split(";");
            for (String detail : details) {
                int oldproductid = Integer.parseInt(detail.split(":")[0]);
                String newdetail = detail + ";";
                result = AddProductToCart(UserID, newdetail, oldproductid);
            }
            EmptyCart(sessionCartID);
        }
        return result;
    }

    public static String GetCartProductDetail(int UserID) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String detail = DBManager.GetString(Tables.Cart.ProductDetails, Tables.Cart.Table, "where " + Tables.Cart.UserID + " = " + UserID);
        return detail;
    }

    public static String AddToWishList(int ProId, int userId) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String wishList = GetWishListItems(userId);
        String res = "";
        if (wishList.equals("none")) {
            HashMap<String, Object> data = new HashMap<>();
            data.put(Tables.WishList.UserID, userId);
            data.put(Tables.WishList.ProductIDs, ProId + ";");
            res = DBManager.insertTableData(Tables.WishList.Table, data, "");
        } else {
            if (!wishList.contains(ProId + ";")) {
                wishList = wishList + ProId + ";";
                res = DBManager.UpdateStringData(Tables.WishList.Table, Tables.WishList.ProductIDs, wishList, "where " + Tables.WishList.UserID + " = " + userId);
            } else {
                res = "Product already exists in WishList";
            }
        }
        return res;
    }

    public static String GetWishListItems(int userId) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String res = DBManager.GetString(Tables.WishList.ProductIDs, Tables.WishList.Table, "where " + Tables.WishList.UserID + " = " + userId);
        return res;
    }

    public static String RemoveFromWishList(int ProId, int userId) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String wishList = GetWishListItems(userId);
        String res = "";
        wishList = wishList.replace(ProId + ";", "");
        if (!wishList.equals("")) {
            res = DBManager.UpdateStringData(Tables.WishList.Table, Tables.WishList.ProductIDs, wishList, "where " + Tables.WishList.UserID + " = " + userId);
        } else {
            res = DBManager.DeleteObject(Tables.WishList.Table, "where " + Tables.WishList.UserID + " = " + userId);
        }
        return res;
    }

    public static String EmptyWishList(int userId) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String res = "";
        res = DBManager.DeleteObject(Tables.WishList.Table, "where " + Tables.WishList.UserID + " = " + userId);
        return res;
    }

    public static String AddAllToCart(int UserID) throws ClassNotFoundException, SQLException, ParseException, UnsupportedEncodingException {
        String res = "";
        ArrayList<Integer> proIds = new ArrayList<>();
        String wishlist = GetWishListItems(UserID);
        String productdetail = "";
        if (!wishlist.equals("none")) {
            String[] Ids = wishlist.split(";");
            for (String pid : Ids) {
                int id = Integer.parseInt(pid);
                proIds.add(id);
                HashMap<String, String> result = GeneralProductManager.GetProductDetails(id);
                String price = result.get("selling_price");
                int quantity = 1;
                productdetail = id + ":" + quantity + ":" + price + ";";
                AddProductToCart(UserID, productdetail, id);
            }
            res = EmptyWishList(UserID);
        }
        return res;
    }

    public static int getUserCartID(int UserID) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        int result = 0;
        result = DBManager.GetInt(Tables.Cart.ID, Tables.Cart.Table, "where " + Tables.Cart.UserID + " = " + UserID);
        return result;
    }

    public static String AddProductToCart(int UserID, String productdetails, int productid) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String result = "";
        int cartid = ProductManager.getUserCartID(UserID);
        if (cartid == 0) {
            HashMap<String, Object> tableData = new HashMap<>();
            tableData.put(Tables.Cart.UserID, UserID);
            tableData.put(Tables.Cart.ProductDetails, productdetails);
            tableData.put(Tables.Cart.Status, "Pending");
            tableData.put(Tables.Cart.ProductCount, 1);
            result = DBManager.insertTableData(Tables.Cart.Table, tableData, "");
        } else {
            String OldProductDetails = getCartProductDetails(cartid);
            String details[] = OldProductDetails.split(";");
            ArrayList<Integer> oldprodids = new ArrayList<>();
            for (String detail : details) {
                int oldproductid = Integer.parseInt(detail.split(":")[0]);
                oldprodids.add(oldproductid);
            }
            if (!oldprodids.contains(productid)) {
                int count = getUserCartProductCount(UserID);
                int NewCountValue = count + 1;
                String ProductDetails = getCartProductDetails(cartid);
                String NewProductDetails = ProductDetails + productdetails;
                result = DBManager.UpdateStringData(Tables.Cart.Table, Tables.Cart.ProductDetails, NewProductDetails, "where " + Tables.Cart.ID + " = " + cartid);
                DBManager.UpdateIntData(Tables.Cart.ProductCount, NewCountValue, Tables.Cart.Table, "where " + Tables.Cart.ID + " = " + cartid);
            } else {
                result = "exist";
            }
        }

        return result;
    }

    public static int getUserCartProductCount(int UserID) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        int result = 0;
        result = DBManager.GetInt(Tables.Cart.ProductCount, Tables.Cart.Table, "where " + Tables.Cart.Status + " = 'Pending' AND " + Tables.Cart.UserID + " = " + UserID);
        return result;
    }

    public static String getCartProductDetails(int cartid) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String result = "";
        result = DBManager.GetString(Tables.Cart.ProductDetails, Tables.Cart.Table, "where " + Tables.Cart.ID + " = " + cartid);
        return result;
    }

    public static String GetCartProductDetails(int UserID) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String result = "";
        result = DBManager.GetString(Tables.Cart.ProductDetails, Tables.Cart.Table, "where " + Tables.Cart.UserID + " = " + UserID);
        return result;
    }

    public static String RemoveFromCart(int UserID, String productdetails) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        int count = DBManager.GetInt(Tables.Cart.ProductCount, Tables.Cart.Table, "where " + Tables.Cart.UserID + " = " + UserID);
        int NewCountValue = count - 1;
        String result = DBManager.UpdateStringData(Tables.Cart.Table, Tables.Cart.ProductDetails, productdetails, "where " + Tables.Cart.UserID + " = " + UserID);
        DBManager.UpdateIntData(Tables.Cart.ProductCount, NewCountValue, Tables.Cart.Table, "where " + Tables.Cart.UserID + " = " + UserID);
        return result;
    }

    public static String EmptyCart(int UserID) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String result = DBManager.DeleteObject(Tables.Cart.Table, "where " + Tables.Cart.UserID + " = " + UserID);
        return result;
    }

    public static String UpdateCartProductDetails(int UserID, String CartProductDetails) throws ClassNotFoundException, SQLException, UnsupportedEncodingException {
        String result = "";
        result = DBManager.UpdateStringData(Tables.Cart.Table, Tables.Cart.ProductDetails, CartProductDetails, "where " + Tables.Cart.UserID + " = " + UserID);
        return result;
    }

    public static int PlaceOrder(int UserID, int OrderAmount, String DeliveryFees, int addressID, String addressType, String paymentType) throws ClassNotFoundException, SQLException, ParseException, UnsupportedEncodingException {
        int orderid = 0;
        String DeliveryAddress = "";
        if (addressType.equals("UseMyAddress")) {
            DeliveryAddress = GeneralUserManager.GetUserDeliveryAddress(addressID);
        } else if (addressType.equals("PickUpCenter")) {
            DeliveryAddress = GeneralUserManager.GetUserPickUpAddress(addressID);
        }
        String CartProductDetails = GetCartProductDetails(UserID);
        String OrderNumber = GeneralAccountManager.generateRandomNumber(8);
        String NewOrderNumber = GeneralProductManager.CheckGeneratedNumberInDB(OrderNumber, "Order", "");
        java.sql.Date CurrentDate = UtilityManager.CurrentDate();
        Time CurrentTime = UtilityManager.CurrentTime();
        HashMap<String, Object> tableData = new HashMap<>();
        tableData.put(Tables.Orders.UserID, UserID);
        tableData.put(Tables.Orders.Amount, OrderAmount);
        tableData.put(Tables.Orders.OrderNumber, NewOrderNumber);
        tableData.put(Tables.Orders.ProductDetails, CartProductDetails);
        tableData.put(Tables.Orders.Status, "Pending");
        tableData.put(Tables.Orders.BookedDate, CurrentDate);
        tableData.put(Tables.Orders.BookedTime, CurrentTime);
        tableData.put(Tables.Orders.DeliveryAddress, DeliveryAddress);
        tableData.put(Tables.Orders.DeliveryFees, DeliveryFees);
        tableData.put(Tables.Orders.PaymentType, paymentType);
        orderid = DBManager.insertTableDataReturnID(Tables.Orders.Table, tableData, "");
        if (orderid != 0) {
            EmptyCart(UserID);
            GeneralMessageManager.sendMemberMessage(1, "You have placed an order, please check your email for product summary", "Placed Order", UserID);
            String Comment = "You placed an order, please check your email for product summary";
            String TransactionName = "Transfers";
            int chargesAmount = GeneralAccountManager.GetTransactionTypeChargesAmount(TransactionName);
            if (paymentType.equals("WithCash")) {
                GeneralAccountManager.Transfer(GeneralAccountManager.WealthMarketUserID, GeneralAccountManager.WealthMarketUserID, 1, 1, 3, OrderAmount, "To-Online", Comment, TransactionName, chargesAmount);
            } else if (paymentType.equals("WithWarrant")) {
                GeneralAccountManager.Transfer(UserID, UserID, 1, 1, 3, OrderAmount, "To-Online", Comment, TransactionName, chargesAmount);
            }
            if (!CartProductDetails.equals("none")) {
                String details[] = CartProductDetails.split(";");
                for (String record : details) {
                    int productid = Integer.parseInt(record.split(":")[0]);
                    String qty = record.split(":")[1];
                    String price = record.split(":")[2];
                    String result = GeneralProductManager.LogOrderHistory(orderid, productid, price, qty, UserID, "" + CurrentDate, "" + CurrentTime);
                    int TransTypeId = GeneralAccountManager.GetInventoryTypeIDByType("Products Inventory");
                    int InventoryTypeID = GeneralInventoryManager.GetInventoryTypeIdByInventoryType("Products");
                    String productname = DBManager.GetString(Tables.Product_Definition.Name, Tables.Product_Definition.Table, "where " + Tables.Product_Definition.ID + " = " + productid);
                    String Description = "An order has been placed for product - " + productname;
                    GeneralInventoryManager.LogInventoryTransaction(UserID, productid, InventoryTypeID, "", TransTypeId, Description);
                }
            }
        }
        return orderid;
    }

}
