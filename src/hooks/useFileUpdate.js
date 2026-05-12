import { useMutation } from '@tanstack/react-query';
import axios from "axios";

const useFileUpdate = () => {
    return useMutation({
        mutationFn: (formData) =>
            axios.post('/api/fileUpdate', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }).then((res) => res.data),
    });
};

export default useFileUpdate;