import styled from "@emotion/styled";
import {
  SearchOutlined,
  CaretLeftFilled,
  CaretRightFilled,
} from "@ant-design/icons";
import "./fonts.css";

interface ISearchBarOpen {
  isOpen: boolean;
}

export const MapSection = styled.div`
  display: flex;

  #map {
    width: 100%;//920px;
    height: 100vh;//600px;
    position: absolute;
    overflow: hidden;
    font-size: 100px;
  }
  
  #menuDiv {
    display: flex;
    position: relative;
    z-index: 2;
    font-size: 12px;
  }

  #menu_wrap {
    position: relative;
    width: 400px;
    min-height: 100vh;
    max-height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    background: rgba(255, 255, 255, 1);
    display: ${(props: ISearchBarOpen) => (props.isOpen ? "" : "none")};
    box-sizing: border-box;
  }

    /* 스크롤바css */
    #menu_wrap::-webkit-scrollbar {
    width: 6px;
    // height: 500px;
  }

  #menu_wrap::-webkit-scrollbar-thumb {
    // hegiht: 100px;
    background-color: rgba(255, 153, 0, 0.3);
    border-radius: 2px;
    transition: width 0.2s ease-in-out;
  }

  #menu_wrap::-webkit-scrollbar-thumb:hover {
    background-color:rgba(165, 201, 252, 0.5);
  }

  #map_title {
    display: flex;
    justify-content: center;
    font-size: 50px;
    // font-weight: bold;
    align-items: center;
    width: 100%;
    padding: 10px;
    width: 365px;
    margin: auto;
    margin-top: 15px;
    position: relative;
    right: 13px;
  }

  #form {
    display: flex;
    justify-content: space-between;
    padding: 0px 15px 10px 15px;
    width: 350px;
    margin: 5px auto;
    text-color: #10A19D;
  }

  #keyword {
    width: 100%;
    border: none;
    outline: none;
    border: medium solid #FF9900;
  }

  #submit_btn {
    background-color: #FF9900;
    border: medium solid #FF9900;
    // border: none;
    outline: none;
  }

  #placesList h5 {
    font-size: 19px;
    color: black;
    font-weight: bold;
  }
  #placesList {
    margin-left: 17px;
    margin-right: 17px;
  }
  #placesList li {
    list-style: square;
  }
  #placesList .item {
    border-bottom: 1px solid #888;
    overflow: hidden;
    cursor: pointer;
  }

  #placesList .item .info {
    padding: 10px 0 10px 5px;
  }

  #placesList .item span {
    display: block;
    margin-top: 10px;
  }
  #placesList .info .gray {
    color: #8a8a8a;
  }

  #placesList .info .tel {
    color: #009900;
  }

  #btnDiv {
    min-height:100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #pagination {
    margin: 10px auto;
    text-align: center;
    font-size: 14px;
    padding: 5px 0px 5px 0px;
  }
  #pagination a {
    display: inline-block;
    margin-right: 20px;
    color: #7b7b7b; 
    border: none;
    text-decoration: none;
    
  }
  #pagination .on {
    font-weight: bold;
    cursor: default;
    color: #FF9900;
    font-size: 15px;
    text-decoration: underline;
  }

  #btnOn {
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #searchBtn {
    width: 20px;
    padding: 0px;
    height: 100px;
    background-color: #FF9900;
    border: none;
    outline: none;
  }
  
  #infowindow {
    font-size: 15px;
    font-family:'IBMPlexSansKR-Regular';
    font-weight: bold;
    border-radius:10px;
    border:2.5px solid #FF9900;
    background-color: white;
    position:relative;
  }

`;

export const SearchIcon = styled(SearchOutlined)`
  color: #fff;
  cursor: pointer;
  font-size: 20px;
`;

export const LeftDisplayButton = styled(CaretLeftFilled)`
  color: #fff;
  cursor: pointer;
`;
export const RightDisplayButton = styled(CaretRightFilled)`
  color: #fff;
`;