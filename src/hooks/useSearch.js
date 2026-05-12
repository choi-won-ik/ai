import { useQuery } from '@tanstack/react-query';
import axios from "axios";


const useSearch = (query) => {
    return useQuery({
        queryKey: ["search", query],
        queryFn: () =>
            axios
                .post('/api/fileUpdate', { query: query })
                .then((res) => res.data),
        enabled: query.trim().length > 0, // 검색어 없으면 요청 안 함
        staleTime: 1000 * 60 * 5,         // 5분 (Infinity 대신 적절한 값)
        gcTime: 1000 * 60 * 10,           // 10분
        retry: false,
    });
};

export default useSearch;