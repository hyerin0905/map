import { useEffect, useState } from "react";
import * as S from "./WriteMap.styled";

declare const window: typeof globalThis & {
  kakao: any;
};

export default function WriteMapPage(props: any) {
  useEffect(() => {
    const script = document.createElement("script");
    //           "//dapi.kakao.com/v2/maps/sdk.js?appkey=4e5e27aa0d9d1242ba7d2faaada2b&libraries=services&autoload=false";
      
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=4e5e27aa0d9d1242ba7d2faaada2b72f&libraries=services&autoload=false";
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(function () {
        let markers: any[] = [];

        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.566569, 126.978305),
          level: 4,
        };
        const map = new window.kakao.maps.Map(container, options);
        map.setCopyrightPosition(window.kakao.maps.CopyrightPosition.BOTTOMRIGHT,true);

        const markerPosition = new window.kakao.maps.LatLng(
          38.2313466,
          128.2139293
        );

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          clickable: true,
        });

        marker.setMap(map);

        const ps = new window.kakao.maps.services.Places();

        const infowindow = new window.kakao.maps.CustomOverlay({ zIndex: 1 });

        const searchForm = document.getElementById("submit_btn");
        searchForm?.addEventListener("click", function (e) {
          e.preventDefault();
          searchPlaces();
        });

        function searchPlaces() {
          const keyword = (
            document.getElementById("keyword") as HTMLInputElement
          ).value;

          if (!keyword.replace(/^\s+|\s+$/g, "")) {
            alert("키워드를 입력해주세요!");
            return false;
          }

          ps.keywordSearch(keyword, placesSearchCB);
        }

        function placesSearchCB(data: any, status: any, pagination: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            displayPlaces(data);

            displayPagination(pagination);

            const bounds = new window.kakao.maps.LatLngBounds();
            for (let i = 0; i < data.length; i++) {
              displayMarker(data[i]);
              bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
            }

            map.setBounds(bounds);
          } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            alert("검색 결과가 존재하지 않습니다.");
          } else if (status === window.kakao.maps.services.Status.ERROR) {
            alert("검색 결과 중 오류가 발생했습니다.");
          }
        }

        function displayMarker(place: any) {
          const marker = new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });
          window.kakao.maps.event.addListener(
            marker,
            "click",
            function (mouseEvent: any) {
              props.setAddress(place);
              
              displayInfowindow(marker, place.place_name);
              // infowindow.setContent(`
              // <span>
              // ${place.place_name}
              // </span>
              // `);
              // infowindow.open(map, marker);
              const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
              map.panTo(moveLatLon);
            }
          );
        }

        function displayPlaces(places: any) {
          const listEl = document.getElementById("placesList");
          const menuEl = document.getElementById("menu_wrap");
          const fragment = document.createDocumentFragment();
          // const bounds = new window.kakao.maps.LatLngBounds();
          removeAllChildNods(listEl);
          removeMarker();
          for (let i = 0; i < places.length; i++) {
            const placePosition = new window.kakao.maps.LatLng(
              places[i].y,
              places[i].x
            );
            const marker = addMarker(placePosition, i);
            const itemEl = getListItem(i, places[i]);
            // bounds.extend(placePosition);
            (function (marker, title) {
              window.kakao.maps.event.addListener(
                marker,
                "mouseover",
                function () {
                  displayInfowindow(marker, title);
                }
              );

              // window.kakao.maps.event.addListener(
              //   marker,
              //   "mouseout",
              //   function () {
              //     infowindow.close();
              //   }
              // );


              itemEl.addEventListener("click", function (e) {
                displayInfowindow(marker, title);
                props.setAddress(places[i]);
                map.panTo(placePosition);
              });
            })(marker, places[i].place_name);

            fragment.appendChild(itemEl);
          }

          listEl?.appendChild(fragment);
          //  menuEl.scrollTop = 0;             // CHANGED
          if (menuEl) menuEl.scrollTop = 0;     // CHANGED

          // map.panTo(bounds);
        }

        function getListItem(index: any, places: any) {
          const el = document.createElement("li");

          let itemStr =
            '<span class="markerbg marker_' +
            (index + 1) +
            '"></span>' +
            '<div class="info">' +
            "   <h5>" +
            places.place_name +
            "</h5>";

          if (places.road_address_name) {
            itemStr +=
              "    <span>" +
              places.road_address_name +
              "</span>" +
              '   <span class="jibun gray">' +
              `<img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png">
              </img>` +
              places.address_name +
              "</span>";
          } else {
            itemStr += "    <span>" + places.address_name + "</span>";
          }

          itemStr +=
            '  <span class="tel">' + places.phone + "</span>" + "</div>";

          el.innerHTML = itemStr;
          el.className = "item";

          return el;
        }

        function addMarker(position: any, idx: any) {
          const imageSrc =
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
          const imageSize = new window.kakao.maps.Size(36, 37);
          const imgOptions = {
            spriteSize: new window.kakao.maps.Size(36, 691),
            spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
            offset: new window.kakao.maps.Point(13, 37),
          };

          const markerImage = new window.kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imgOptions
          );

          const marker = new window.kakao.maps.Marker({
            position,
            image: markerImage,
          });

          marker.setMap(map);
          markers.push(marker);

          return marker;
        }

        function removeMarker() {
          for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }
          markers = [];
        }

        function displayPagination(pagination: any) {
          const paginationEl = document.getElementById("pagination");
          const fragment = document.createDocumentFragment();
          while (paginationEl?.hasChildNodes()) {
            // paginationEl.removeChild(paginationEl.lastChild);    // CHANGED
            if (paginationEl && paginationEl.lastChild)
              paginationEl.removeChild(paginationEl.lastChild);
          }

          for (let i = 1; i <= pagination.last; i++) {
            const el = document.createElement("a");
            el.href = "#";
            el.innerHTML = String(i);

            if (i === pagination.current) {
              el.className = "on";
            } else {
              el.onclick = (function (i) {
                return function () {
                  pagination.gotoPage(i);
                };
              })(i);
            }

            fragment.appendChild(el);
          }
          paginationEl?.appendChild(fragment);
        }

        function displayInfowindow(marker: any, title: any) {
          const content =
            '<div id=infowindow style="padding:10px;z-index:1;">' + title + "</div>";

          infowindow.setContent(content);
          ///// CustomOverlay의 좌표를 지정하기 위해 작성 //////
          var markpos = marker.getPosition()
          var proj = map.getProjection()
          var startOverlayPoint = proj.containerPointFromCoords(markpos)
          var newPoint = new window.kakao.maps.Point(startOverlayPoint.x,startOverlayPoint.y-50)
          var newPos = proj.coordsFromContainerPoint(newPoint)
          infowindow.setPosition(newPos)
          infowindow.setMap(map);
        }

        function removeAllChildNods(el: any) {
          while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
          }
        }
      });
    };
  }, []);




  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const onchangeSearch = (event: any) => {
    setSearch(event?.target.value);
  };
  // 소윤 추가
  const onKeyDown = (event: any) => {
    if(event.key == 'Enter') {
      test();
    } 
  }

  // 소윤 추가
  const test = () => {};

  const onClickSearchBarOpen = () => {
    setIsOpen(!isOpen);
  };

  const onClicklogo = () => {
    window.location.reload();
  };


  return (
    <S.MapSection className="map_wrap" isOpen={isOpen}>
      <div id="map" style={{width:'100%', height:'100%'}}></div>
      <div id="menuDiv">
        <div id="menu_wrap" className="bg_white" style={{height:'969px'}}>
          <div className="option">
            <div>
              <div id="map_title">
                <div id="map_logo" onClick={onClicklogo} style={{'cursor':'pointer'}}>
                <svg width="120" height="70" viewBox="0 0 119 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.68 20.08C23.68 19.04 24 18.1867 24.64 17.52C25.3067 16.8533 26.16 16.52 27.2 16.52C28.1867 16.52 29.0267 16.8533 29.72 17.52C30.4133 18.2133 30.76 19.0667 30.76 20.08C30.76 21.0933 30.4133 21.9467 29.72 22.64C29.0267 23.36 28.1867 23.72 27.2 23.72C26.1867 23.72 25.3467 23.36 24.68 22.64C24.0133 21.9467 23.68 21.0933 23.68 20.08ZM9.64 20.08C9.64 19.0667 9.97333 18.2133 10.64 17.52C11.3067 16.8533 12.1467 16.52 13.16 16.52C14.1733 16.52 15.0133 16.8533 15.68 17.52C16.3733 18.2133 16.72 19.0667 16.72 20.08C16.72 21.0933 16.3733 21.9467 15.68 22.64C15.0133 23.36 14.1733 23.72 13.16 23.72C12.1467 23.72 11.3067 23.36 10.64 22.64C9.97333 21.9467 9.64 21.0933 9.64 20.08ZM35.56 27.5944C36.2533 27.5944 36.8267 27.8477 37.28 28.3544C37.76 28.861 38 29.501 38 30.2744V41.3944C38 43.3144 37.6133 45.0077 36.84 46.4744C36.0933 47.9677 35.0133 49.1144 33.6 49.9144C32.2133 50.741 30.6 51.1544 28.76 51.1544C26.8933 51.1544 25.2533 50.7544 23.84 49.9544C22.4533 49.1544 21.3733 48.021 20.6 46.5544C19.8533 45.0877 19.48 43.3677 19.48 41.3944L19.48 32.9544H13.6C12.32 32.9544 11.3333 32.4877 10.64 31.5544C9.97333 30.6477 9.64 29.3277 9.64 27.5944L35.56 27.5944ZM24.12 41.3944C24.12 42.8077 24.5333 43.901 25.36 44.6744C26.1867 45.4477 27.3333 45.8344 28.8 45.8344C30.24 45.8344 31.36 45.4344 32.16 44.6344C32.96 43.861 33.36 42.781 33.36 41.3944V32.9544H24.12V41.3944Z" fill="#FF9900"/>
                  <path d="M45.87 52C45.29 52 44.79 51.79 44.37 51.37C43.97 50.95 43.77 50.45 43.77 49.87V33.7C43.77 32.7 44.1 31.96 44.76 31.48C45.42 30.98 46.43 30.73 47.79 30.73V48.52H55.89C56.83 48.52 57.54 48.82 58.02 49.42C58.5 50 58.74 50.86 58.74 52H45.87ZM62.7164 52.27C61.8564 52.17 61.1764 51.87 60.6764 51.37C60.1964 50.87 59.9564 50.24 59.9564 49.48C59.9564 48.9 60.0964 48.3 60.3764 47.68L67.2464 32.05C67.6264 31.17 68.2864 30.73 69.2264 30.73C70.1464 30.73 70.7964 31.17 71.1764 32.05L78.0464 47.68C78.3264 48.34 78.4664 48.94 78.4664 49.48C78.4664 50.24 78.2164 50.87 77.7164 51.37C77.2364 51.87 76.5564 52.17 75.6764 52.27L73.1564 46.57H65.2664L62.7164 52.27ZM71.9264 43.15L68.6264 34.93L68.2664 35.08L68.9864 36.94L66.4664 43.15H71.9264ZM89.2655 52.27C87.4855 52.27 85.8955 51.93 84.4955 51.25C83.1155 50.57 82.0355 49.62 81.2555 48.4C80.4755 47.18 80.0855 45.79 80.0855 44.23V38.71C80.0855 37.15 80.4655 35.77 81.2255 34.57C82.0055 33.35 83.0755 32.41 84.4355 31.75C85.7955 31.07 87.3555 30.73 89.1155 30.73C90.8755 30.73 92.4355 31 93.7955 31.54C95.1755 32.06 96.2455 32.8 97.0055 33.76C97.7655 34.7 98.1455 35.78 98.1455 37C98.1455 37.74 97.8955 38.33 97.3955 38.77C96.9155 39.19 96.2655 39.4 95.4455 39.4C95.0455 39.4 94.6055 39.34 94.1255 39.22C94.1655 38.74 94.1855 38.27 94.1855 37.81C94.1855 36.75 93.7155 35.89 92.7755 35.23C91.8355 34.57 90.6155 34.24 89.1155 34.24C87.6355 34.24 86.4255 34.66 85.4855 35.5C84.5655 36.32 84.1055 37.39 84.1055 38.71V44.23C84.1055 45.57 84.5855 46.66 85.5455 47.5C86.5055 48.34 87.7455 48.76 89.2655 48.76C90.7655 48.76 91.9855 48.43 92.9255 47.77C93.8655 47.11 94.3355 46.26 94.3355 45.22C94.3355 44.74 94.3155 44.28 94.2755 43.84C94.7755 43.74 95.1955 43.69 95.5355 43.69C96.3755 43.69 97.0455 43.91 97.5455 44.35C98.0455 44.79 98.2955 45.39 98.2955 46.15C98.2955 47.33 97.9155 48.39 97.1555 49.33C96.3955 50.25 95.3255 50.97 93.9455 51.49C92.5855 52.01 91.0255 52.27 89.2655 52.27ZM101.192 32.83C101.192 32.33 101.382 31.9 101.762 31.54C102.162 31.18 102.642 31 103.202 31H116.582C116.582 32.2 116.372 33.08 115.952 33.64C115.552 34.18 114.892 34.45 113.972 34.45H105.212V39.67H113.192C113.192 40.87 112.982 41.75 112.562 42.31C112.162 42.85 111.502 43.12 110.582 43.12H105.212V48.55H114.602C115.502 48.55 116.152 48.83 116.552 49.39C116.972 49.93 117.182 50.8 117.182 52H103.202C102.642 52 102.162 51.83 101.762 51.49C101.382 51.13 101.192 50.69 101.192 50.17V32.83Z" fill="black"/>
                  <path d="M76.94 21.18C75.7533 21.18 74.6933 20.9533 73.76 20.5C72.84 20.0467 72.12 19.4133 71.6 18.6C71.08 17.7867 70.82 16.86 70.82 15.82V12.14C70.82 11.1 71.0733 10.18 71.58 9.38C72.1 8.56667 72.8133 7.94 73.72 7.5C74.6267 7.04667 75.6667 6.82 76.84 6.82C78.0133 6.82 79.0533 7 79.96 7.36C80.88 7.70667 81.5933 8.2 82.1 8.84C82.6067 9.46667 82.86 10.1867 82.86 11C82.86 11.4933 82.6933 11.8867 82.36 12.18C82.04 12.46 81.6067 12.6 81.06 12.6C80.7933 12.6 80.5 12.56 80.18 12.48C80.2067 12.16 80.22 11.8467 80.22 11.54C80.22 10.8333 79.9067 10.26 79.28 9.82C78.6533 9.38 77.84 9.16 76.84 9.16C75.8533 9.16 75.0467 9.44 74.42 10C73.8067 10.5467 73.5 11.26 73.5 12.14V15.82C73.5 16.7133 73.82 17.44 74.46 18C75.1 18.56 75.9267 18.84 76.94 18.84C77.94 18.84 78.7533 18.62 79.38 18.18C80.0067 17.74 80.32 17.1733 80.32 16.48C80.32 16.16 80.3067 15.8533 80.28 15.56C80.6133 15.4933 80.8933 15.46 81.12 15.46C81.68 15.46 82.1267 15.6067 82.46 15.9C82.7933 16.1933 82.96 16.5933 82.96 17.1C82.96 17.8867 82.7067 18.5933 82.2 19.22C81.6933 19.8333 80.98 20.3133 80.06 20.66C79.1533 21.0067 78.1133 21.18 76.94 21.18ZM90.4109 21.18C89.3176 21.18 88.3176 20.9667 87.4109 20.54C86.5043 20.1 85.7843 19.5067 85.2509 18.76C84.7309 18.0133 84.4709 17.2 84.4709 16.32V11.66C84.4709 10.78 84.7309 9.97333 85.2509 9.24C85.7843 8.49333 86.5043 7.90667 87.4109 7.48C88.3176 7.04 89.3176 6.82 90.4109 6.82C91.5043 6.82 92.5043 7.04 93.4109 7.48C94.3309 7.90667 95.0509 8.49333 95.5709 9.24C96.1043 9.97333 96.3709 10.78 96.3709 11.66V16.32C96.3709 17.2 96.1043 18.0133 95.5709 18.76C95.0509 19.5067 94.3309 20.1 93.4109 20.54C92.5043 20.9667 91.5043 21.18 90.4109 21.18ZM90.4109 18.84C91.4109 18.84 92.2109 18.6067 92.8109 18.14C93.4109 17.66 93.7109 17.04 93.7109 16.28V11.72C93.7109 10.9467 93.4109 10.3267 92.8109 9.86C92.2109 9.38 91.4109 9.14 90.4109 9.14C89.4243 9.14 88.6309 9.38 88.0309 9.86C87.4309 10.3267 87.1309 10.9467 87.1309 11.72V16.28C87.1309 17.04 87.4309 17.66 88.0309 18.14C88.6309 18.6067 89.4243 18.84 90.4109 18.84ZM98.3089 8.82C98.3089 8.20667 98.5489 7.72 99.0289 7.36C99.5089 6.98667 100.162 6.8 100.989 6.8L105.189 17.36L104.729 18.62L104.929 18.7L109.429 6.82C110.242 6.82 110.889 7.00667 111.369 7.38C111.862 7.74 112.109 8.22667 112.109 8.84V21.18C110.362 21.18 109.489 20.5267 109.489 19.22V12.82L110.169 10.98L109.949 10.9L106.289 20.46C106.196 20.6733 106.049 20.8467 105.849 20.98C105.662 21.1133 105.449 21.18 105.209 21.18C104.969 21.18 104.749 21.1133 104.549 20.98C104.362 20.8467 104.222 20.6667 104.129 20.44L100.469 10.88L100.249 10.96L100.909 12.8V19.22C100.909 20.5267 100.042 21.18 98.3089 21.18V8.82Z" fill="black"/>
                  </svg>
                </div>
              </div>

              <form>
              <div id="form">
                <input
                  type="text"
                  value={search}
                  id="keyword"
                  onChange={onchangeSearch}
                  onKeyDown={onKeyDown}
                  style={{fontSize:'16px',fontFamily:'IBMPlexSansKR-Regular'}}
                />
                <button id="submit_btn" type="submit" onClick={test} style={{height:'40px'}}>
                  <div className="icon">
                    <S.SearchIcon/>
                  </div> 
                </button>
              </div>
              </form>
            </div>
          </div>

          <ul id="placesList"></ul>
          <div id="pagination"></div>
        </div>

        <div id="btnDiv">
          {isOpen ? (
            <div id="btnOn">
              <button
                id="searchBtn"
                onClick={onClickSearchBarOpen}
                type="button"
              >
                <S.LeftDisplayButton />
              </button>
            </div>
          ) : (
            <div id="btnOn">
              <button
                id="searchBtn"
                onClick={onClickSearchBarOpen}
                type="button"
              >
                <S.RightDisplayButton />
              </button>
            </div>
          )}
        </div>
      </div>
    </S.MapSection>
    
  );
}