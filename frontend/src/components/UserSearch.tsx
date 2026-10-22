import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

type UserSuggestion = {
  id: string; // Use number here if your IDs are numbers.
  username: string;
};

type Props = {
  token: string;
  onSelect: (user: UserSuggestion) => void;
};

export default function UserSearch({ token, onSelect }: Props) {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<UserSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = input.trim();

    setUsers([]);
    setError("");
    setLoading(false);

    if (query.length < 2) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/users/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const results: UserSuggestion[] = await response.json();

        if (!controller.signal.aborted) {
          setUsers(results);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not search users");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [input, token]);

  return (
    <Autocomplete
      options={users}
      loading={loading}
      filterOptions={(options) => options}
      getOptionLabel={(user) => user.username}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      onInputChange={(_, value) => setInput(value)}
      onChange={(_, user) => {
        if (user) onSelect(user);
      }}
      noOptionsText={
        input.trim().length < 2
          ? "Type at least 2 characters"
          : "No users found"
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search users"
          error={Boolean(error)}
          helperText={error}
        />
      )}
      sx={{ width: "100%", maxWidth: 400 }}
    />
  );
}