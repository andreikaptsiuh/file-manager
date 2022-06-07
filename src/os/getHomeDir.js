export const getHomedir = () => {
	return process.env.HOME || process.env.USERPROFILE;
};
