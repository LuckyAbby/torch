/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50714
Source Host           : localhost:3306
Source Database       : torch

Target Server Type    : MYSQL
Target Server Version : 50714
File Encoding         : 65001

Date: 2017-02-26 19:52:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `articles`
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `article_id` int(11) NOT NULL AUTO_INCREMENT,
  `article_title` varchar(255) DEFAULT NULL,
  `article_content` text,
  `article_clicks` int(11) DEFAULT '0',
  `student_id` int(11) DEFAULT NULL,
  `article_type` varchar(255) DEFAULT NULL,
  `article_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`)
) ENGINE=MyISAM AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `comments`
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_content` varchar(255) NOT NULL,
  `student_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `comment_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;



-- ----------------------------
-- Table structure for `login`
-- ----------------------------
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `student_id` int(9) NOT NULL,
  `password` varchar(255) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `id_card` char(255) NOT NULL,
  `major` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



-- ----------------------------
-- Table structure for `support`
-- ----------------------------
DROP TABLE IF EXISTS `support`;
CREATE TABLE `support` (
  `support_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `support_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `support_flag` varchar(255) NOT NULL,
  PRIMARY KEY (`support_id`)
) ENGINE=MyISAM AUTO_INCREMENT=122 DEFAULT CHARSET=utf8;

