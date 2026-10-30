import React, { useContext, useEffect, useState } from "react";
import profile from "../../assets/profile.png";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import StoreContext from "../../context/storeContext";
import { base_url } from "../../config/config";
import axios from "axios";
import { convert } from "html-to-text";
import { toast } from "react-hot-toast";
const NewsContent = () => {
  const { store } = useContext(StoreContext);
  const [news, setNews] = useState([]);
  const [all_news, set_all_news] = useState([]);
  //console.log(news);
  const [perPage, setPerPage] = useState(5);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);

  const get_news = async () => {
    try {
      /**
      const response = await axios.get(...)	The entire response object
      const { data } = await axios.get(...)	Only the response’s data property
       */
      const { data } = await axios.get(`${base_url}/api/news`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      set_all_news(data.news);
      setNews(data.news);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    get_news();
  }, []);

  useEffect(() => {
    setPages(Math.ceil(news.length / perPage));
  }, [news, perPage]);

  const deleteNews = async (newsId) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        const { data } = await axios.delete(
          `${base_url}/api/news/delete/${newsId}`,
          {
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          },
        );
        toast.success(data.message);
        get_news();
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex items-center gap-4 mb-6">
        <select
          name="status"
          className="w-48 px-4 py-2 rounded-md border border-gray-300 focus:ring-4 focus:ring-blue-400"
        >
          <option value=""> --- Select Status</option>
          <option value="pending">Pending</option>
          <option value="active"> Active </option>
          <option value="deactive"> Deactive </option>
        </select>
        <input
          type="text"
          placeholder="Search News"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-4 px-6 text-left"> No </th>
              <th className="py-4 px-6 text-left"> Title </th>
              <th className="py-4 px-6 text-left"> Image </th>
              <th className="py-4 px-6 text-left"> Category </th>
              <th className="py-4 px-6 text-left"> Description </th>
              <th className="py-4 px-6 text-left"> Date </th>
              <th className="py-4 px-6 text-left"> Status </th>
              <th className="py-4 px-6 text-left"> Action </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {/*
       🧩 news.slice(start, end)
      slice(start, end) returns a new array containing items from index start up to but not including end.

      The two arguments:

      js
      start = (page - 1) * perPage     // first item index on this page
      end   = page * perPage           // one past the last item index
      Why (page - 1)?
      Because arrays are 0-indexed but pages are 1-indexed for humans.

      Page	Formula (page-1)*5	start	end page*5	Indices shown
      1	(1-1)*5 = 0	0	5	[0,1,2,3,4]
      2	(2-1)*5 = 5	5	10	[5,6,7,8,9]
      3	(3-1)*5 = 10	10	15	[10,11,12,13,14]
      4	(4-1)*5 = 15	15	20	[15,16,17,18,19]
      5	(5-1)*5 = 20	20	25	[20,21,22] ← only 3 left
      Notice end for page 5 is 25, but the array only has 23 items. slice doesn't throw — it silently caps at news.length. So you get exactly the 3 remaining items. ✅

      Full trace with news = [n0, n1, … n22] (23 items), perPage = 5
      js
      // page = 1
      news.slice(0, 5)   // → [n0, n1, n2, n3, n4]

      // page = 2
      news.slice(5, 10)  // → [n5, n6, n7, n8, n9]

      // page = 5  (last page)
      news.slice(20, 25) // → [n20, n21, n22]   ← slice caps at 23
      Edge case — page beyond the data
      js
      // page = 9, perPage = 5
      news.slice(40, 45)  // → []   (no items at those indices)
      slice returns an empty array — no error. That's why you also want the "clamp" useEffect from before, to stop the user landing on a page that doesn't exist.

      🧩 Piece 3: .map((n, i) => ...)
      map loops over only the sliced items (max perPage of them) and returns a <tr> for each.

      n = the news item object (e.g. { _id, title, image, status, … })

      i = the index within this page's slice, starting at 0 every time
       */}
            {news.length > 0 &&
              news.slice((page - 1) * perPage, page * perPage).map((n, i) => (
                //console.log(i)
                <tr key={i} className="border-t">
                  <td className="py-4 px-6">{(page - 1) * perPage + i + 1} </td>
                  <td className="py-4 px-6"> {n.title.slice(0, 15)}...</td>
                  <td className="py-4 px-6">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={n.image}
                      alt="news"
                    />
                  </td>
                  <td className="py-4 px-6"> {n.category}</td>
                  <td className="py-4 px-6">
                    {" "}
                    {convert(n.description).slice(0, 15)}...
                  </td>
                  <td className="py-4 px-6"> {n.date}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-green-200 rounded-full text-xs font-semibold">
                      {n.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3 text-gray-500">
                      <Link
                        to="#"
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-800"
                      >
                        <FaEye />
                      </Link>
                      {store?.userInfo?.role === "writer" && (
                        <>
                          <Link
                            to={`/dashboard/news/edit/${n._id}`}
                            className="p-2 bg-yellow-500 rounded text-white hover:bg-yellow-800"
                          >
                            <FaEdit />
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => deleteNews(n._id)}
                        to="#"
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-800"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center py-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold">News per page:</label>

          {/**
           Think of it like a hotel room key:
        Each <option> is a door with a fixed number on it ("5", "10", "15", "20").
        The <select value={perPage}> is the key you're holding.
        The browser looks at the key (perPage), finds the door with the matching number, and opens that door.
        The doors don't change. Only the key changes. And the key is perPage — which is fully dynamic.              
           */}
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(parseInt(e.target.value));
              setPage(1);
            }}
            name="category"
            id="category"
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="5">5</option>
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-bold">
            {(page - 1) * perPage + 1} /{news.length} - {pages}
          </span>
          <div className="flex gap-2">
            <IoIosArrowBack
              onClick={() => {
                if (page > 1) setPage(page - 1);
              }}
              className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-800 "
            />
            <IoIosArrowForward
              onClick={() => {
                if (page < pages) setPage(page + 1);
              }}
              className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-800 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsContent;
