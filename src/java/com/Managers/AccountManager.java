/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.Managers;

import wmengine.Managers.GeneralAccountManager;
import wmengine.Managers.GeneralUserManager;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.text.ParseException;

/**
 *
 * @author Saint
 */
public class AccountManager {

    public AccountManager() {

    }

    public static String QuickTransfer(int FromUserID, int ToUserID, int AccountDefID, int PIN, int Amount, String Narration) throws ClassNotFoundException, SQLException, ParseException, UnsupportedEncodingException {
        String result = "";
        String receiverName = GeneralUserManager.getUserName(ToUserID);
        String senderName = GeneralUserManager.getUserName(FromUserID);
        int FromUserOldAcctBalance = 0;
        int ConfirmPIN = GeneralAccountManager.GetUserTransactionPIN(FromUserID);
        FromUserOldAcctBalance = GeneralAccountManager.GetUserAvailableBalance(FromUserID, AccountDefID);
        if (ConfirmPIN == PIN) {
            if (FromUserOldAcctBalance > Amount) {
                String Comment = "Transfer of N" + Amount + " From " + senderName + " to " + receiverName + " - " + Narration;
                String TransactionName = "Transfers";
                int chargesAmount = GeneralAccountManager.GetTransactionTypeChargesAmount(TransactionName);
                result = GeneralAccountManager.Transfer(FromUserID, ToUserID, AccountDefID, 1, 1, Amount, "To-Online", Comment, TransactionName, chargesAmount);
            } else {
                result = "You don't have enough funds to make this transaction";
            }
        } else {
            result = "Incorrect Transaction PIN";
        }
        return result;
    }

}
