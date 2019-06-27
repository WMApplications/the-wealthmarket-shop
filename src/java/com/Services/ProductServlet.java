/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Services;

import wmengine.Managers.*;
import wmengine.Tables.Tables;
import com.Managers.ProductManager;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author Saint
 */
public class ProductServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ClassNotFoundException, SQLException, ParseException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            HttpSession session = request.getSession(true);
            String temp = "" + session.getAttribute("Id");
            String cart = "" + session.getAttribute("cart");
            String json = "";
            String json1 = "";
            String json2 = "";
            String json3 = "";
            String type = request.getParameter("type").trim();
            String empty = "none";
            String result = "";
            switch (type) {
                case "GetProductSubCategories": {
                    String catid = request.getParameter("data");
                    int CatID = Integer.parseInt(catid);
                    ArrayList<Integer> topcatids = GeneralProductManager.getTopCategory_CatIDs(CatID, 0, 4);
                    HashMap<Integer, HashMap<String, String>> catList = new HashMap<>();
                    HashMap<Integer, Object> TopCatSubs = new HashMap<>();
                    if (!topcatids.isEmpty()) {
                        for (int topcatid : topcatids) {
                            HashMap<String, String> topcatdetails = GeneralProductManager.GetProductCatDetails(topcatid);
                            if (!topcatdetails.isEmpty()) {
                                catList.put(topcatid, topcatdetails);
                                ArrayList<Integer> subcatids = new ArrayList<>();
                                subcatids = GeneralProductManager.getSubCatIDsWithLimit(topcatid, 0, 4);
                                if (!subcatids.isEmpty()) {
                                    for (int subcatid : subcatids) {
                                        HashMap<String, String> subcatdetails = GeneralProductManager.GetProductCatDetails(subcatid);
                                        catList.put(subcatid, subcatdetails);
                                    }
                                }
                                TopCatSubs.put(topcatid, subcatids);
                            }
                        }
                        json1 = new Gson().toJson(catList);
                        json2 = new Gson().toJson(TopCatSubs);
                        json = "[" + json1 + "," + json2 + "]";
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetSubCategories": {
                    String catid = request.getParameter("data");
                    int CatID = Integer.parseInt(catid);
                    HashMap<Integer, HashMap<String, String>> catList = new HashMap<>();
                    ArrayList<Integer> subcatids = GeneralProductManager.getTopCategory_CatIDs(CatID, 0, 5);
                    if (!subcatids.isEmpty()) {
                        for (int subcatid : subcatids) {
                            HashMap<String, String> subcatdetails = GeneralProductManager.GetProductCatDetails(subcatid);
                            catList.put(subcatid, subcatdetails);
                        }
                        json = new Gson().toJson(catList);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetCateogryProducts": {
                    //this fn was hardcoded cos of time, pls update or rewrite to meet same purpose.
                    ArrayList<Integer> prodIds = GeneralProductManager.GetRandomProducts();

                    ArrayList<Integer> proIds = new ArrayList<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList1 = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList2 = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList3 = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList4 = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList5 = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList6 = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList7 = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList8 = new HashMap<>();
                    if (!prodIds.isEmpty()) {
                        for (int id : prodIds) {
                            proIds.add(id);
                            int ProdCatID = GeneralProductManager.GetProductCategoryIdByProductId(id);
                            int parentProdCatID = GeneralProductManager.getTopCategoryIDBySubCategoryID(ProdCatID);
                            HashMap<String, String> res = new HashMap<>();
                            if (parentProdCatID == 13) {//Grocery
                                res = GeneralProductManager.GetProductDetails(id);
                                if (!res.isEmpty()) {
                                    int pdtList1 = ProdDetailsList1.size();
                                    if (pdtList1 <= 3) {
                                        ProdDetailsList1.put(id, res);
                                    }
                                }
                            }
                            if (parentProdCatID == 9) {//Computing
                                res = GeneralProductManager.GetProductDetails(id);
                                if (!res.isEmpty()) {
                                    int pdtList2 = ProdDetailsList2.size();
                                    if (pdtList2 <= 3) {
                                        ProdDetailsList2.put(id, res);
                                    }
                                }
                            }
                            if (parentProdCatID == 11) {//Fashion
                                res = GeneralProductManager.GetProductDetails(id);
                                int pdtList3 = ProdDetailsList3.size();
                                if (pdtList3 <= 3) {
                                    ProdDetailsList3.put(id, res);
                                }
                            }
                            if (parentProdCatID == 18) {//phones and tabs
                                res = GeneralProductManager.GetProductDetails(id);
                                int pdtList4 = ProdDetailsList4.size();
                                if (pdtList4 <= 3) {
                                    ProdDetailsList4.put(id, res);
                                }
                            }
                            if (parentProdCatID == 4) {//automobiles
                                res = GeneralProductManager.GetProductDetails(id);
                                int pdtList5 = ProdDetailsList5.size();
                                if (pdtList5 <= 3) {
                                    ProdDetailsList5.put(id, res);
                                }
                            }
                            if (parentProdCatID == 15) {//home and kitchen
                                res = GeneralProductManager.GetProductDetails(id);
                                int pdtList6 = ProdDetailsList6.size();
                                if (pdtList6 <= 3) {
                                    ProdDetailsList6.put(id, res);
                                }
                            }
                            if (parentProdCatID == 10) {//electronics
                                res = GeneralProductManager.GetProductDetails(id);
                                int pdtList7 = ProdDetailsList7.size();
                                if (pdtList7 <= 3) {
                                    ProdDetailsList7.put(id, res);
                                }
                            }
                            if (parentProdCatID == 5) {
                                res = GeneralProductManager.GetProductDetails(id);
                                int pdtList8 = ProdDetailsList8.size();
                                if (pdtList8 <= 3) {
                                    ProdDetailsList8.put(id, res);
                                }
                            }
                        }
                        json1 = new Gson().toJson(ProdDetailsList1);
                        json2 = new Gson().toJson(ProdDetailsList2);
                        json3 = new Gson().toJson(ProdDetailsList3);
                        String json4 = new Gson().toJson(ProdDetailsList4);
                        String json5 = new Gson().toJson(ProdDetailsList5);
                        String json6 = new Gson().toJson(ProdDetailsList6);
                        String json7 = new Gson().toJson(ProdDetailsList7);
                        String json8 = new Gson().toJson(ProdDetailsList8);
                        json = "[" + json1 + "," + json2 + "," + json3 + "," + json4 + "," + json5 + "," + json6 + "," + json7 + "," + json8 + "]";
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetLeftFeaturedProducts": {
                    int count = 8;
                    ArrayList<Integer> prodIds = GeneralProductManager.GetRandomProducts();
                    ArrayList<Integer> proIds = new ArrayList<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    if (!prodIds.isEmpty()) {
                        for (int i = 0; i < 4; i++) {
                            int id = prodIds.get(i);
                            proIds.add(id);
                            HashMap<String, String> res = GeneralProductManager.GetProductDetails(id);
                            ProdDetailsList.put(id, res);
                        }
                        json = new Gson().toJson(ProdDetailsList);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetFeaturedProducts": {
                    ArrayList<Integer> prodIds = GeneralProductManager.GetRandomProducts();
                    ArrayList<Integer> proIds = new ArrayList<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    if (!prodIds.isEmpty()) {
                        for (int i = 0; i < 18; i++) {
                            int id = prodIds.get(i);
                            proIds.add(id);
                            HashMap<String, String> res = GeneralProductManager.GetProductDetails(id);
                            ProdDetailsList.put(id, res);
                        }
                        json = new Gson().toJson(ProdDetailsList);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetLatestProducts": {
                    ArrayList<Integer> prodIds = GeneralProductManager.GetRandomProducts();
                    ArrayList<Integer> proIds = new ArrayList<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    if (!prodIds.isEmpty()) {
                        for (int i = 0; i < 19; i++) {
                            int id = prodIds.get(i);
                            proIds.add(id);
                            HashMap<String, String> res = GeneralProductManager.GetProductDetails(id);
                            ProdDetailsList.put(id, res);
                        }
                        json = new Gson().toJson(ProdDetailsList);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetRelatedProducts": {
                    String prodid = request.getParameter("data");
                    int proId = Integer.parseInt(prodid);
                    ArrayList<Integer> prodIds = GeneralProductManager.GetRelatedProductsById(proId);
                    ArrayList<Integer> proIds = new ArrayList<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    if (!prodIds.isEmpty()) {
                        for (int id : prodIds) {
                            proIds.add(id);
                            HashMap<String, String> res = GeneralProductManager.GetProductDetails(id);
                            if (!res.isEmpty()) {
                                ProdDetailsList.put(id, res);
                            }

                        }
                        json = new Gson().toJson(ProdDetailsList);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetTopDeals": {
                    ArrayList<Integer> prodIds = GeneralProductManager.GetPromoIDS();
                    ArrayList<Integer> proIds = new ArrayList<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    if (!prodIds.isEmpty()) {
                        for (int i = 0; i < 4; i++) {
                            int id = prodIds.get(i);
                            proIds.add(id);
                            HashMap<String, String> res = GeneralProductManager.GetProductDetails(id);
                            ProdDetailsList.put(id, res);
                        }
                        json = new Gson().toJson(ProdDetailsList);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetProductDetails": {
                    String[] data = request.getParameterValues("data[]");
                    String proIdstr = data[0].trim();
                    int proId = Integer.parseInt(proIdstr);
                    HashMap<String, String> res = GeneralProductManager.GetProductDetails(proId);
                    if (!res.isEmpty()) {
                        json = new Gson().toJson(res);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetProducts": {
                    String[] data = request.getParameterValues("data[]");
                    String categoryID = data[0].trim();
                    String searchQuery = data[1].trim();
                    String countstr = data[2].trim();
                    String sort_by = data[3].trim();
                    int count = Integer.parseInt(countstr);
                    int end = 1000;
                    ArrayList<Integer> ids = new ArrayList<>();
                    HashMap<String, ArrayList<String>> property_Value = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> Property_Value = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProductsList = new HashMap<>();
                    String category1;
                    String categoryDescription = "";
                    String cat;

                    int catId = Integer.parseInt(categoryID);
                    if (catId > 0) {
                        ids = GeneralCategoryManager.GetCategoryProductIds(catId, count, end);
                        category1 = GeneralCategoryManager.GetCategoryName(catId);
                        categoryDescription = GeneralCategoryManager.GetCategoryDescription(catId);
                    } else {
                        if (searchQuery.equals("null") || searchQuery.equals("")) {
                            searchQuery = "";
                            category1 = "All Products";
                            categoryDescription = "All WealthMarket Listed Products";
                        } else {
                            category1 = "Search Results for '" + searchQuery + "'";
                        }
                        if (sort_by.equalsIgnoreCase("name")) {
                            sort_by = "name DESC";
                            ids = GeneralProductManager.GetProducts(searchQuery, count, end, sort_by);
                        } else if (sort_by.equalsIgnoreCase("lowestprice")) {
                            sort_by = "selling_price DESC";
                            ids = GeneralProductManager.GetProducts(searchQuery, count, end, sort_by);
                        } else if (sort_by.equalsIgnoreCase("highestprice")) {
                            sort_by = "selling_price";
                            ids = GeneralProductManager.GetProducts(searchQuery, count, end, sort_by);
                        } else if (sort_by.equalsIgnoreCase("newest")) {
                            sort_by = "date_added";
                            ids = GeneralProductManager.GetProducts1(searchQuery, count, end, sort_by);
                        } else //(sort_by.equalsIgnoreCase("BEST RATINGS")){
                        {
                            sort_by = "ratings DESC";
                            ids = GeneralProductManager.GetProducts1(searchQuery, count, end, sort_by);
                        }
                    }
                    json1 = new Gson().toJson(category1);
                    json2 = new Gson().toJson(categoryDescription);
                    json3 = new Gson().toJson(catId);
                    cat = "[" + json1 + "," + json2 + "," + json3 + "]";
                    if (!ids.isEmpty()) {
                        ids.removeAll(Collections.singleton(0));
                        int i = 0;
                        for (int id : ids) {
                            HashMap<String, String> res = GeneralProductManager.GetProductDetails(id);
                            ArrayList<String> values = new ArrayList<>();
                            HashMap<String, String> prod_prop_val = new HashMap<>();
                            String prop = res.get(Tables.ProductRecord.Properties);
                            String[] arr = prop.split(";");
                            for (String prop_val : arr) {
                                String properties = prop_val.substring(0, prop_val.indexOf("-")).trim();
                                prod_prop_val.put(properties, prop_val.substring(prop_val.indexOf("-") + 1, prop_val.length()));
                                if (property_Value.containsKey(properties)) {
                                    ArrayList<String> value = property_Value.get(properties);
                                    value.add(prop_val.substring(prop_val.indexOf("-") + 1, prop_val.length()).trim());
                                    Set<String> hs = new HashSet<>();
                                    hs.addAll(value);
                                    value.clear();
                                    value.addAll(hs);
                                    property_Value.put(properties, value);
                                } else {
                                    values.add(prop_val.substring(prop_val.indexOf("-") + 1, prop_val.length()).trim());
                                    property_Value.put(properties, values);
                                }
                            }
                            ProductsList.put(i, res);
                            Property_Value.put(i, prod_prop_val);
                            i += 1;
                        }
                        String prop1 = new Gson().toJson(property_Value);
                        String prop2 = new Gson().toJson(Property_Value);
                        String prop = "[" + prop1 + "," + prop2 + "]";
                        String prods = new Gson().toJson(ProductsList);

                        json = "[" + cat + "," + prods + "," + prop + "]";
                    } else {
                        String none = new Gson().toJson(empty);
                        json = "[" + cat + "," + none + "," + none + "]";
                    }
                    break;
                }
                case "GetPromoProducts": {
                    ArrayList<Integer> ids = new ArrayList<>();
                    HashMap<String, ArrayList<String>> property_Value = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> Property_Value = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> ProductsList = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> PromoList = new HashMap<>();
                    HashMap<Integer, ArrayList<HashMap<String, String>>> PromoProducts = new HashMap<>();

                    ids = GeneralProductManager.GetPromoIDS();
                    if (!ids.isEmpty()) {
                        for (int promoid : ids) {
                            HashMap<String, String> PromoDetails = GeneralProductManager.GetPromoDetails(promoid);
                            if (!PromoDetails.isEmpty()) {
                                ArrayList<HashMap<String, String>> productIds = new ArrayList<>();
                                PromoList.put(promoid, PromoDetails);
                                String proddetails = PromoDetails.get(Tables.Promo.ProductDetails);
                                if (!proddetails.equals("none")) {
                                    String details[] = proddetails.split(";");
                                    for (String record : details) {
                                        String productid = record.split(":")[0];
                                        String promoprice = record.split(":")[1];
                                        int ProductID = Integer.parseInt(productid);
                                        HashMap<String, String> res = GeneralProductManager.GetProductDetails(ProductID);
                                        productIds.add(res);
                                        ArrayList<String> values = new ArrayList<>();
                                        HashMap<String, String> prod_prop_val = new HashMap<>();
                                        String prop = res.get(Tables.ProductRecord.Properties);
                                        String[] arr = prop.split(";");
                                        for (String prop_val : arr) {
                                            String properties = prop_val.substring(0, prop_val.indexOf("-"));
                                            prod_prop_val.put(properties, prop_val.substring(prop_val.indexOf("-") + 1, prop_val.length()));
                                            if (property_Value.containsKey(properties)) {
                                                ArrayList<String> value = property_Value.get(properties);
                                                value.add(prop_val.substring(prop_val.indexOf("-") + 1, prop_val.length()).trim());
                                                Set<String> hs = new HashSet<>();
                                                hs.addAll(value);
                                                value.clear();
                                                value.addAll(hs);
                                                property_Value.put(properties, value);
                                            } else {
                                                values.add(prop_val.substring(prop_val.indexOf("-") + 1, prop_val.length()).trim());
                                                property_Value.put(properties, values);
                                            }
                                        }
                                        ProductsList.put(ProductID, res);
                                        Property_Value.put(ProductID, prod_prop_val);
                                    }
                                }
                                PromoProducts.put(promoid, productIds);

                            }
                        }
                        String prop1 = new Gson().toJson(property_Value);
                        String prop2 = new Gson().toJson(Property_Value);
                        String prop = "[" + prop1 + "," + prop2 + "]";

                        json1 = new Gson().toJson(PromoList);
                        json2 = new Gson().toJson(PromoProducts);
                        json3 = new Gson().toJson(prop);
                        json = "[" + json1 + "," + json2 + "," + json3 + "]";
                    } else {
                        String none = new Gson().toJson(empty);
                        json = "[" + 0 + "," + none + "," + none + "]";
                    }
                    break;
                }
                case "AddToWishList": {
                    String data = request.getParameter("data");
                    int UserID = Integer.parseInt(data.split(":")[0]);
                    int ProId = Integer.parseInt(data.split(":")[1]);
                    result = ProductManager.AddToWishList(ProId, UserID);
                    json1 = new Gson().toJson("Add");
                    json2 = new Gson().toJson(result);
                    json = "[" + json1 + "," + json2 + "]";
                    break;
                }
                case "RemoveFromWishList": {
                    String[] data = request.getParameterValues("data[]");
                    int UserID = Integer.parseInt(data[0]);
                    int ProId = Integer.parseInt(data[1]);
                    result = ProductManager.RemoveFromWishList(ProId, UserID);
                    json1 = new Gson().toJson("Remove");
                    json2 = new Gson().toJson(result);
                    json = "[" + json1 + "," + json2 + "]";
                    break;
                }
                case "EmptyWishList": {
                    String userid = request.getParameter("data");
                    int UserID = Integer.parseInt(userid);
                    result = ProductManager.EmptyWishList(UserID);
                    json1 = new Gson().toJson("Empty");
                    json2 = new Gson().toJson(result);
                    json = "[" + json1 + "," + json2 + "]";
                    break;
                }
                case "AddAllToCart": {
                    String userid = request.getParameter("data");
                    int UserID = Integer.parseInt(userid);
                    result = ProductManager.AddAllToCart(UserID);
                    json1 = new Gson().toJson("Empty");
                    json2 = new Gson().toJson(result);
                    json = "[" + json1 + "," + json2 + "]";
                    break;
                }
                case "GetUserWishList": {
                    ArrayList<Integer> proIds = new ArrayList<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    String userid = request.getParameter("data");
                    int UserID = Integer.parseInt(userid);
                    String wishList = ProductManager.GetWishListItems(UserID);
                    if (!wishList.equals("none")) {
                        String[] Ids = wishList.split(";");
                        for (String pid : Ids) {
                            int id = Integer.parseInt(pid);
                            proIds.add(id);
                            HashMap<String, String> res = GeneralProductManager.GetProductDetails(id);
                            ProdDetailsList.put(id, res);
                        }
                        json = new Gson().toJson(ProdDetailsList);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }

                case "AddToCart": {
                    String data = request.getParameter("data");
                    int UserID = 0;
                    if (cart.equals("null") || cart.equals("")) {
                        try {
                            String userId = GeneralAccountManager.generateRandomNumber(6);
                            UserID = Integer.parseInt(userId);
                            session.setAttribute("cart", UserID);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    } else {
                        UserID = Integer.parseInt(cart);
                    }
                    if (temp.equals("null") || temp.equals("")) {
                    } else {
                        UserID = Integer.parseInt(temp);
                    }
                    String pid = data.split(":")[0];
                    int productid = Integer.parseInt(pid);
                    String ProductDetails = data;

                    result = ProductManager.AddProductToCart(UserID, ProductDetails, productid);
                    ProductManager.RemoveFromWishList(productid, UserID);
                    json1 = new Gson().toJson("Add");
                    json2 = new Gson().toJson(result);
                    json3 = new Gson().toJson(UserID);
                    json = "[" + json1 + "," + json2 + "," + json3 + "]";
                    break;
                }
                case "EmptyCartList": {
                    int UserID = 0;
                    if (cart.equals("null") || cart.equals("")) {
                        String userId = GeneralAccountManager.generateRandomNumber(3);
                        UserID = Integer.parseInt(userId);
                        session.setAttribute("cart", UserID);
                    } else {
                        UserID = Integer.parseInt(cart);
                    }
                    if (temp.equals("null") || temp.equals("")) {
                    } else {
                        UserID = Integer.parseInt(temp);
                    }
                    result = ProductManager.EmptyCart(UserID);
                    json1 = new Gson().toJson("Empty");
                    json2 = new Gson().toJson(result);
                    json = "[" + json1 + "," + json2 + "]";
                    break;
                }
                case "GetUserCartList": {
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    int UserID = 0;
                    if (cart.equals("null") || cart.equals("")) {
                    } else {
                        UserID = Integer.parseInt(cart);
                    }
                    if (temp.equals("null") || temp.equals("")) {
                    } else {
                        UserID = Integer.parseInt(temp);
                    }
                    String productdetails = ProductManager.GetCartProductDetails(UserID);
                    if (!productdetails.equals("none")) {
                        String details[] = productdetails.split(";");
                        int TotalAmount = 0;
                        for (String record : details) {
                            String productid = record.split(":")[0];
                            int ProductID = Integer.parseInt(productid);
                            HashMap<String, String> res = GeneralProductManager.GetProductDetails(ProductID);
                            String Quantity = record.split(":")[1];
                            res.put("Quantity", Quantity);
                            String Amount = record.split(":")[2];
                            res.put("Amount", Amount);
                            int amt = Integer.parseInt(Amount);
                            TotalAmount = TotalAmount + amt;
                            ProdDetailsList.put(ProductID, res);
                        }
                        json1 = new Gson().toJson(ProdDetailsList);
                        json2 = new Gson().toJson(TotalAmount);
                        json = "[" + json1 + "," + json2 + "]";
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "DeleteProductFromCart": {
                    String ProductID = request.getParameter("data");
                    int UserID = 0;
                    if (cart.equals("null") || cart.equals("")) {
                    } else {
                        UserID = Integer.parseInt(cart);
                    }
                    if (temp.equals("null") || temp.equals("")) {
                    } else {
                        UserID = Integer.parseInt(temp);
                    }
                    String productdetails = ProductManager.GetCartProductDetails(UserID);
                    if (!productdetails.equals("none")) {
                        String details[] = productdetails.split(";");
                        if (details.length > 1) {
                            String newrecord = "";
                            for (String record : details) {
                                if (!record.split(":")[0].equals(ProductID)) {
                                    newrecord = newrecord.concat(record) + ";";
                                }
                            }
                            String NewProductDetails = newrecord;
                            result = ProductManager.RemoveFromCart(UserID, NewProductDetails);

                        } else {
                            result = ProductManager.EmptyCart(UserID);
                        }
                        json1 = new Gson().toJson("Remove");
                        json2 = new Gson().toJson(result);
                        json = "[" + json1 + "," + json2 + "]";
                    } else {
                        json1 = new Gson().toJson("Remove");
                        json2 = new Gson().toJson("empty");
                        json = "[" + json1 + "," + json2 + "]";
                    }

                    break;
                }
                case "UpdateCartProduct": {
                    String[] data = request.getParameterValues("data[]");
                    int UserID = 0;
                    if (cart.equals("null") || cart.equals("")) {
                    } else {
                        UserID = Integer.parseInt(cart);
                    }
                    if (temp.equals("null") || temp.equals("")) {
                    } else {
                        UserID = Integer.parseInt(temp);
                    }
                    String productid = data[0];
                    String ProductDetails = data[1];

                    String productdetails = ProductManager.GetCartProductDetails(UserID);
                    if (!productdetails.equals("none")) {
                        String details[] = productdetails.split(";");
                        String newrecord = "";
                        String oldrecord = "";
                        for (String record : details) {
                            if (record.split(":")[0].equals(productid)) {
                                newrecord = ProductDetails;
                            } else {
                                oldrecord = oldrecord.concat(record) + ";";
                            }
                        }
                        String NewProductDetails = oldrecord.concat(newrecord);
                        result = ProductManager.UpdateCartProductDetails(UserID, NewProductDetails);
                        json1 = new Gson().toJson("Update");
                        json2 = new Gson().toJson(result);
                        json = "[" + json1 + "," + json2 + "]";
                    } else {
                        json1 = new Gson().toJson("Update");
                        json2 = new Gson().toJson("empty");
                        json = "[" + json1 + "," + json2 + "]";
                    }

                    break;
                }
                case "GetUserCartCount": {
                    int UserID = 0;
                    if (cart.equals("null") || cart.equals("")) {
                    } else {
                        UserID = Integer.parseInt(cart);
                    }
                    if (temp.equals("null") || temp.equals("")) {
                    } else {
                        UserID = Integer.parseInt(temp);
                    }
                    int count = ProductManager.getUserCartProductCount(UserID);
                    json = new Gson().toJson(count);
                    break;
                }
                case "PlaceOrder": {
                    String[] data = request.getParameterValues("data[]");
                    int UserID = Integer.parseInt(data[0]);
                    String FinalOrderAmount = data[1].trim();
                    String FinalDeliveryFees = data[2];
                    int addressID = Integer.parseInt(data[3]);
                    String addressType = data[4];
                    String paymentType = data[5];
                    int OrderAmount = Integer.parseInt(FinalOrderAmount);
                    int orderid = ProductManager.PlaceOrder(UserID, OrderAmount, FinalDeliveryFees, addressID, addressType, paymentType);
                    if (orderid != 0) {
                        json1 = new Gson().toJson("success");
                        json2 = new Gson().toJson(orderid);
                        json = "[" + json1 + "," + json2 + "]";
                    } else {
                        json1 = new Gson().toJson(empty);
                        json = "[" + json1 + "]";
                    }

                    break;
                }
                case "GetOrderNODetails": {
                    String orderNO = request.getParameter("data");
                    int OrderNumber = Integer.parseInt(orderNO);
                    HashMap<String, String> orderNoDetails = GeneralProductManager.GetOrderNODetails(OrderNumber);
                    if (!orderNoDetails.isEmpty()) {
                        int userid = Integer.parseInt(orderNoDetails.get(Tables.Orders.UserID));
                        String userPhone = GeneralUserManager.getUserPhone(userid);
                        String userName = GeneralUserManager.getUserName(userid);
                        String userEmail = GeneralUserManager.getUserEmail(userid);
                        orderNoDetails.put("userPhone", userPhone);
                        orderNoDetails.put("userEmail", userEmail);
                        orderNoDetails.put("userName", userName);
                        json1 = new Gson().toJson("success");
                        json2 = new Gson().toJson(orderNoDetails);
                        json = "[" + json1 + "," + json2 + "]";
                    } else {
                        json1 = new Gson().toJson(empty);
                        json = "[" + json1 + "]";
                    }

                    break;
                }
                case "GetUserOrderList": {
                    String[] data = request.getParameterValues("data[]");
                    int UserID = Integer.parseInt(data[0]);
                    String ordertype = data[1];
                    ArrayList<Integer> IDS = new ArrayList<>();
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> OrderDetailsList = new HashMap<>();
                    HashMap<Integer, ArrayList<Integer>> orderProducts = new HashMap<>();
                    IDS = GeneralProductManager.GetOrderIDS(UserID);
                    if (!IDS.isEmpty()) {
                        for (int Oid : IDS) {
                            HashMap<String, String> OrderDetails = new HashMap<>();
                            if (ordertype.equals("All")) {
                                OrderDetails = GeneralProductManager.GetOrderDetails(Oid, "");
                            } else {
                                OrderDetails = GeneralProductManager.GetOrderDetails(Oid, ordertype);
                            }
                            if (!OrderDetails.isEmpty()) {
                                ArrayList<Integer> productIds = new ArrayList<>();
                                OrderDetailsList.put(Oid, OrderDetails);
                                String productdetails = OrderDetails.get(Tables.Orders.ProductDetails);
                                if (!productdetails.equals("none")) {
                                    String details[] = productdetails.split(";");
                                    for (String record : details) {
                                        String productid = record.split(":")[0];
                                        int ProductID = Integer.parseInt(productid);
                                        productIds.add(ProductID);
                                        HashMap<String, String> res = GeneralProductManager.GetProductDetails(ProductID);
                                        ProdDetailsList.put(ProductID, res);
                                    }
                                }
                                orderProducts.put(Oid, productIds);
                            }
                        }
                        json1 = new Gson().toJson(OrderDetailsList);
                        json2 = new Gson().toJson(ProdDetailsList);
                        json3 = new Gson().toJson(orderProducts);
                        json = "[" + json1 + "," + json2 + "," + json3 + "]";
                    } else {
                        json1 = new Gson().toJson(empty);
                        json = "[" + json1 + "]";
                    }

                    break;
                }
                case "GetPlacedOrder": {
                    String params = request.getParameter("data");
                    int OrderID = Integer.parseInt(params);
                    HashMap<Integer, HashMap<String, String>> ProdDetailsList = new HashMap<>();
                    HashMap<Integer, HashMap<String, String>> OrderDetailsList = new HashMap<>();
                    HashMap<Integer, ArrayList<Integer>> orderProducts = new HashMap<>();

                    HashMap<String, String> OrderDetails = GeneralProductManager.GetOrderDetails(OrderID, "");
                    if (!OrderDetails.isEmpty()) {
                        ArrayList<Integer> productIds = new ArrayList<>();
                        int Userid = Integer.parseInt(OrderDetails.get(Tables.Orders.UserID));
                        String UserName = GeneralUserManager.getUserName(Userid);
                        String UserPhone = GeneralUserManager.getUserPhone(Userid);
                        String UserEmail = GeneralUserManager.getUserEmail(Userid);
                        OrderDetails.put("UserName", UserName);
                        OrderDetails.put("UserPhone", UserPhone);
                        OrderDetails.put("UserEmail", UserEmail);
                        OrderDetailsList.put(OrderID, OrderDetails);
                        String productdetails = OrderDetails.get(Tables.Orders.ProductDetails);
                        if (!productdetails.equals("none")) {
                            String details[] = productdetails.split(";");
                            for (String record : details) {
                                String productid = record.split(":")[0];
                                String qty = record.split(":")[1];
                                String amt = record.split(":")[2];
                                int ProductID = Integer.parseInt(productid);
                                productIds.add(ProductID);
                                HashMap<String, String> res = GeneralProductManager.GetProductDetails(ProductID);
                                String price = res.get(Tables.Product_Definition.SellingPrice);
                                res.put("pquantity", qty);
                                res.put("pamount", amt);
                                res.put("price", price);
                                ProdDetailsList.put(ProductID, res);
                            }
                        }
                        orderProducts.put(OrderID, productIds);

                        json1 = new Gson().toJson(OrderDetailsList);
                        json2 = new Gson().toJson(ProdDetailsList);
                        json3 = new Gson().toJson(orderProducts);
                        json = "[" + json1 + "," + json2 + "," + json3 + "]";
                    } else {
                        json1 = new Gson().toJson(empty);
                        json = "[" + json1 + "]";
                    }
                    break;
                }
                case "CancelOrder": {
                    String[] data = request.getParameterValues("data[]");
                    int UserID = Integer.parseInt(data[0]);
                    String orderid = data[1].trim();
                    int OrderID = Integer.parseInt(orderid);
                    String Status = GeneralProductManager.getOrderStatus(OrderID);
                    if (!Status.equals("Cancelled")) {
                        String OrderAmount = GeneralProductManager.getOrderAmount(OrderID);
                        result = GeneralProductManager.CancelOrderRequest(OrderID, OrderAmount, UserID);
                        json1 = new Gson().toJson("Cancel");
                        json2 = new Gson().toJson(result);
                        json = "[" + json1 + "," + json2 + "]";
                    } else {
                        json1 = new Gson().toJson("Cancel");
                        json2 = new Gson().toJson(empty);
                        json = "[" + json1 + "," + json2 + "]";
                    }
                    break;
                }

                case "ReviewProduct": {
                    String[] data = request.getParameterValues("data[]");
                    String userid = data[0].trim();
                    String productid = data[1].trim();
                    String ratevalue = data[2].trim();
                    String Comment = data[3].trim();
                    int UserId = Integer.parseInt(userid);
                    int ProdId = Integer.parseInt(productid);
                    int RateIndex = Integer.parseInt(ratevalue);
                    result = GeneralReviewManager.PostProductReview(UserId, RateIndex, Comment, ProdId, "Product");
                    json1 = new Gson().toJson(result);
                    json2 = new Gson().toJson(ProdId);
                    json = "[" + json1 + "," + json2 + "]";
                    break;
                }
                case "GetProductReviews": {
                    String[] data = request.getParameterValues("data[]");
                    String productid = data[0].trim();
                    String count = data[1].trim();
                    int ProdId = Integer.parseInt(productid);
                    int cnt = Integer.parseInt(count);
                    int end = 20;
                    HashMap<Integer, HashMap<String, String>> reviewList = new HashMap<>();
                    ArrayList<Integer> GetProductReviewIds = GeneralReviewManager.GetProductReviewIds(ProdId, cnt, end);
                    if (!GetProductReviewIds.isEmpty()) {
                        for (int i : GetProductReviewIds) {
                            HashMap<String, String> det = new HashMap<>();
                            det = GeneralReviewManager.GetReviewDetails(i);
                            if (!det.isEmpty()) {
                                reviewList.put(i, det);
                            }
                        }
                        json = new Gson().toJson(reviewList);
                    } else {
                        json = new Gson().toJson("none");
                    }
                    break;
                }
                case "GetUserProductReviews": {
                    String userid = request.getParameter("data");
                    int UserID = Integer.parseInt(userid);
                    HashMap<Integer, HashMap<String, String>> ReviewList = new HashMap<>();
                    ArrayList<Integer> GetProductReviewIds = GeneralReviewManager.getUserProductReviewIDs(UserID);
                    if (!GetProductReviewIds.isEmpty()) {
                        for (int i : GetProductReviewIds) {
                            HashMap<String, String> det = GeneralReviewManager.GetReviewDetails(i);
                            if (!det.isEmpty()) {
                                ReviewList.put(i, det);
                            }
                        }
                        json = new Gson().toJson(ReviewList);
                    } else {
                        json = new Gson().toJson("none");
                    }
                    break;
                }
                case "GetPickUpStates": {
                    ArrayList<Integer> PickupStateIDs = GeneralUserManager.getPickUpCentreStateIDs();
                    HashMap<Integer, String> CenterList = new HashMap<>();
                    if (!PickupStateIDs.isEmpty()) {
                        for (int stateid : PickupStateIDs) {
                            String state = GeneralUserManager.getStateName(stateid);
                            CenterList.put(stateid, state);
                        }
                        json = new Gson().toJson(CenterList);
                    } else {
                        json = new Gson().toJson("empty");
                    }
                    break;
                }
                case "GetStatePickUpCentres": {
                    String stateid = request.getParameter("data");
                    int StateID = Integer.parseInt(stateid);
                    ArrayList<Integer> PickupStateIDs = GeneralUserManager.getPickUpCentreByStateId(StateID);
                    HashMap<Integer, String> CenterList = new HashMap<>();
                    if (!PickupStateIDs.isEmpty()) {
                        for (int pickupid : PickupStateIDs) {
                            String pickupName = GeneralUserManager.getPickUpCenterName(pickupid);
                            CenterList.put(pickupid, pickupName);
                        }
                        json = new Gson().toJson(CenterList);
                    } else {
                        json = new Gson().toJson("empty");
                    }
                    break;
                }

                case "AddNewUserAddress": {
                    int lcdaid;
                    String[] data = request.getParameterValues("data[]");
                    String addresstype = data[0];
                    int stateid = Integer.parseInt(data[1].trim());
                    int lgaid = Integer.parseInt(data[2].trim());
                    String lcda1 = data[3].trim();
                    if ("".equals(lcda1) || "Select LCDA".equals(lcda1) || "0".equals(lcda1)) {
                        lcdaid = 0;
                    } else {
                        lcdaid = Integer.parseInt(lcda1);
                    }
                    int townid = Integer.parseInt(data[4].trim());
                    int bstopid = Integer.parseInt(data[5].trim());
                    int streetid = Integer.parseInt(data[6].trim());
                    String desc = data[7];
                    int userid = Integer.parseInt(data[8].trim());
                    result = GeneralProductManager.AddUserAddress(addresstype, stateid, lgaid, lcdaid, townid, bstopid, streetid, desc, userid);
                    json = new Gson().toJson(result);
                    break;
                }
                case "EditNewUserAddress": {
                    int lcdaid;
                    String[] data = request.getParameterValues("data[]");
                    String addresstype = data[0];
                    int stateid = Integer.parseInt(data[1].trim());
                    int lgaid = Integer.parseInt(data[2].trim());
                    String lcda1 = data[3].trim();
                    if ("".equals(lcda1) || "Select LCDA".equals(lcda1) || "0".equals(lcda1)) {
                        lcdaid = 0;
                    } else {
                        lcdaid = Integer.parseInt(lcda1);
                    }
                    int townid = Integer.parseInt(data[4].trim());
                    int bstopid = Integer.parseInt(data[5].trim());
                    int streetid = Integer.parseInt(data[6].trim());
                    String desc = data[7];
                    int addid = Integer.parseInt(data[8].trim());
                    result = GeneralProductManager.EditUserAddress(addresstype, stateid, lgaid, lcdaid, townid, bstopid, streetid, desc, addid);
                    json = new Gson().toJson(result);
                    break;
                }
                case "MakeComplain": {
                    String[] data = request.getParameterValues("data[]");
                    int UserID = Integer.parseInt(data[0]);
                    String complainSubject = (data[1]);
                    String complainDescription = (data[2]);
                    int complainOrderNumber = Integer.parseInt(data[3]);
                    result = GeneralProductManager.MakeComplain(complainSubject, complainDescription, UserID, complainOrderNumber);
                    json = new Gson().toJson(result);
                    break;
                }
            }

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        }
    }

// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);

        } catch (ClassNotFoundException | SQLException | ParseException ex) {
            Logger.getLogger(ProductServlet.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);

        } catch (ClassNotFoundException | SQLException | ParseException ex) {
            Logger.getLogger(ProductServlet.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
