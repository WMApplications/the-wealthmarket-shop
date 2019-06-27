/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Services;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import wmengine.Managers.GeneralCategoryManager;
import wmengine.Managers.GeneralProductManager;

/**
 *
 * @author Stephen
 */
public class CategoryServlet extends HttpServlet {

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
            throws ServletException, IOException, ClassNotFoundException, SQLException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            HttpSession session = request.getSession(true);
            String temp = "" + session.getAttribute("Id");
            String json = "";
            String json1 = "";
            String json2 = "";
            String type = request.getParameter("type").trim();
            String empty = "none";
            switch (type) {
                case "GetMenuCategories": {
                    String number = request.getParameter("data");
                    int numb = Integer.parseInt(number);
                    ArrayList<Integer> topcatids = GeneralProductManager.GetProductCatIDsWithLimit(numb);
                    HashMap<Integer, HashMap<String, String>> catList = new HashMap<>();
                    HashMap<Integer, Object> TopCatSubs = new HashMap<>();
                    if (!topcatids.isEmpty()) {
                        for (int topcatid : topcatids) {
                            HashMap<String, String> topcatdetails = GeneralProductManager.GetProductCatDetails(topcatid);
                            catList.put(topcatid, topcatdetails);
                            ArrayList<Integer> subcatids = new ArrayList<>();
                            subcatids = GeneralProductManager.getCatIDsWithLimit(topcatid, 0, 4);
                            if (!subcatids.isEmpty()) {
                                for (int subcatid : subcatids) {
                                    HashMap<String, String> subcatdetails = GeneralProductManager.GetProductCatDetails(subcatid);
                                    catList.put(subcatid, subcatdetails);
                                }
                            }
                            TopCatSubs.put(topcatid, subcatids);
                        }
                        json1 = new Gson().toJson(catList);
                        json2 = new Gson().toJson(TopCatSubs);
                        json = "[" + json1 + "," + json2 + "]";
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetTopCategories": {
                    ArrayList<Integer> ranCatIds = GeneralProductManager.GetRandomTopProductCategories();
                    ranCatIds = new ArrayList<>(new LinkedHashSet<>(ranCatIds));
                    HashMap<Integer, HashMap<String, String>> List = new HashMap<>();
                    ArrayList<Integer> proIds = new ArrayList<>();
                    if (!ranCatIds.isEmpty()) {
                        for (int i = 0; i < 7; i++) {
                            int id = ranCatIds.get(i);
                            proIds.add(id);
                            String catName = GeneralCategoryManager.GetCategoryName(id);
                            String categoryDescription = GeneralCategoryManager.GetCategoryDescription(id);
                            HashMap<String, String> data = new HashMap<>();
                            data.put("name", catName);
                            data.put("desc", categoryDescription);
                            data.put("catid", "" + id);
                            List.put(id, data);
                        }
                        json = new Gson().toJson(List);
                        break;
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetTopProductCategories": {
                    ArrayList<Integer> ranCatIds = GeneralProductManager.GetRandomTopProductCategories();
                    ranCatIds = new ArrayList<>(new LinkedHashSet<>(ranCatIds));
                    HashMap<Integer, HashMap<String, String>> List = new HashMap<>();
                    ArrayList<Integer> proIds = new ArrayList<>();
                    if (!ranCatIds.isEmpty()) {
                        for (int i = 0; i < 7; i++) {
                            int id = ranCatIds.get(i);
                            proIds.add(id);
                            String catName = GeneralCategoryManager.GetCategoryName(id);
                            String categoryDescription = GeneralCategoryManager.GetCategoryDescription(id);
                            HashMap<String, String> data = new HashMap<>();
                            data.put("name", catName);
                            data.put("desc", categoryDescription);
                            List.put(id, data);
                        }
                        json = new Gson().toJson(List);
                        break;
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetCategories": {
                    HashMap<Integer, String> CategoryNameList = GeneralCategoryManager.GetAllCategoriesIdName();
                    if (!CategoryNameList.isEmpty()) {
                        json = new Gson().toJson(CategoryNameList);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetDropDownCategories": {
                    ArrayList<Integer> ids = GeneralProductManager.GetAllTopCategories();
                    HashMap<Integer, HashMap<String, String>> List = new HashMap<>();
                    if (!ids.isEmpty()) {
                        for (int id : ids) {
                            String name = GeneralCategoryManager.GetCategoryName(id);
                            HashMap<String, String> data = new HashMap<>();
                            data.put("name", name);
                            data.put("id", "" + id);
                            List.put(id, data);
                        }
                        json = new Gson().toJson(List);
                    } else {
                        json = new Gson().toJson(empty);
                    }
                    break;
                }
                case "GetAllCategories": {
                    ArrayList<Integer> topcatids = GeneralProductManager.GetAllTopCatategoryIDs();
                    HashMap<Integer, HashMap<String, String>> List = new HashMap<>();
                    HashMap<Integer, ArrayList<HashMap<String, String>>> Categories = new HashMap<>();
                    HashMap<Integer, ArrayList<HashMap<String, String>>> SubCategories = new HashMap<>();
                    if (!topcatids.isEmpty()) {
                        for (int topcatid : topcatids) {
                            HashMap<String, String> topcatdetails = GeneralProductManager.GetProductCatDetails(topcatid);
                            if (!topcatdetails.isEmpty()) {
                                ArrayList<HashMap<String, String>> CatIds = new ArrayList<>();
                                List.put(topcatid, topcatdetails);
                                ArrayList<Integer> catids = GeneralProductManager.getTopCategoryWithoutLimit(topcatid);
                                if (!catids.isEmpty()) {
                                    for (int catid : catids) {
                                        HashMap<String, String> catdetails = GeneralProductManager.GetProductCatDetails(catid);
                                        if (!catdetails.isEmpty()) {
                                            CatIds.add(catdetails);
                                            ArrayList<HashMap<String, String>> SubCatIds = new ArrayList<>();
                                            ArrayList<Integer> subids = GeneralProductManager.getCat_SubCatsWithoutLimit(catid);
                                            if (!subids.isEmpty()) {
                                                for (int subid : subids) {
                                                    HashMap<String, String> subdetails = GeneralProductManager.GetProductCatDetails(subid);
                                                    if (!subdetails.isEmpty()) {
                                                        SubCatIds.add(subdetails);
                                                    }
                                                }
                                                SubCategories.put(catid, SubCatIds);
                                            }
                                        }
                                    }
                                    Categories.put(topcatid, CatIds);
                                }
                            }
                        }
                        json1 = new Gson().toJson(List);
                        json2 = new Gson().toJson(Categories);
                        String json3 = new Gson().toJson(SubCategories);
                        json = "[" + json1 + "," + json2 + "," + json3 + "]";
                    } else {
                        json = new Gson().toJson(empty);
                    }
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
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(CategoryServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(CategoryServlet.class.getName()).log(Level.SEVERE, null, ex);
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
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(CategoryServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(CategoryServlet.class.getName()).log(Level.SEVERE, null, ex);
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
